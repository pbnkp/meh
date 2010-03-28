/* 
 * Gad!
 *
 * // Example
 * var http = require("http"),
 *     fab  = require("./vendor/fab"),
 *     gad  = require("./gad"),
 *     app  = fab()
 *       (fab.listener)
 *       (gad.logger("access.log"))
 *       (/\/public\/(.+)/, gad.file_path('./public'))
 *       ('/', gad.file_path('./public/canvas.html'))
 *     ()
 * http.createServer(app).listen(8080)
 */
var fs   = require("fs"),
    sys  = require("sys"),
    path = require("path"),
    mime_types = {
      ".txt"      : "text/plain",
      ".html"     : "text/html",
      ".css"      : "text/css",
      ".js"       : "application/x-javascript",
      ".manifest" : "text/cache-manifest"
    },
    error_status = {404:'NOT FOUND',403:'FORBIDDEN'}

function error_page(code, back) {
  back({'status':code, 'body':'<h1>'+code+' '+error_status[code]+'</h1>'})()
}

// Uses an URL capture to serve public files from a directory.
// Without an URL capture serves the file specified by loc.
exports.file_path = function (loc) {
  return function (back) {
    return function (req) {
      var nloc = path.normalize(loc),
         fpath = req.url.capture ? path.join(nloc, req.url.capture) : nloc
      if      (!fpath.match('^' + nloc))           error_page(403, back)
      else if (!fpath.match(req.url.pathname+"$")) error_page(404, back)
      else fs.readFile(fpath, function (err, data) {
        if (err) error_page(404, back)
        else back({
            'headers': {'content-type': mime_types[path.extname(fpath)]},
            'body'   : data
          })()
      })
    }
  }
}

// middleware is not a great name. shrug?
exports.middleware = function (fn) {
  return function (down, up) {
    return function (req) {
      fn(req)
      return up(down)(req)
    }
  }
}

// Pass a filename to log to a file, otherwise logs to stdout.
// Only logs requests, not responses.
exports.logger = function (filename) {
  if (filename) {
    var fh = fs.openSync(filename,"w+"),
       log = function (line) { fs.write(fh, line + "\n") }
  } else {
    var log = function (line) { sys.puts(line) }
  }
  return exports.middleware(function (req) {
    log("[" + new Date().toString() + "] " + req.method + "  " + req.url.href)
  })
}
