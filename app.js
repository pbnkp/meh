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

// WARNING: You can access any file on the host with a properly crafted URL.
// FIXME: goto WARNING
exports.public_path = function (loc) {
  return function (back) {
    return function (head) {
      pathname = path.join(loc, head.url.capture[0] + head.url.capture[2])
      back({
        'headers': {'content-type': exports.MIME_TYPES[head.url.capture[2]]},
        'body': fs.readFileSync(pathname)
      })()
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
