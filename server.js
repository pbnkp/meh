var
  http = require("http"),
  sys  = require("sys"),
  fs   = require("fs"),
  fab  = require("./vendor/fab"),
  gad  = require("./app");

var app = fab()
  (fab.listener)
  (gad.logger)
  ('/public', /(\/(\w+))+(\.\w+)/, gad.public_path('./public'))
  ('/', 'hi world')
();

http.createServer(app).listen(0xFAB)

require("repl").start("> ")
