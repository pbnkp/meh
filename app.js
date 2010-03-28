var fs   = require("fs"),
    sys  = require("sys"),
    path = require("path");

exports.MIME_TYPES = {
    ".txt"      : "text/plain",
    ".html"     : "text/html",
    ".css"      : "text/css",
    ".js"       : "application/x-javascript",
    ".manifest" : "text/cache-manifest"
  }

exports.file_path = function (loc) {
  return function (back) {
    return function (req) {
      var nloc = path.normalize(loc),
         fpath = req.url.capture ? path.join(nloc, req.url.capture) : nloc
      if (!fpath.match('^' + nloc))
        back({'status': 403, 'body': '<h1>403 FORBIDDEN</h1>'})()
      else fs.readFile(fpath, function (err, data) {
        if (err) back({'status': 404, 'body': '<h1>404 NOT FOUND</h1>'})()
        else back({
            'headers': {'content-type': exports.MIME_TYPES[path.extname(fpath)]},
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

exports.logger = exports.middleware(function (req) {
  sys.puts("[" + new Date().toString() + "] " + req.method + "  " + req.url.href)
})
