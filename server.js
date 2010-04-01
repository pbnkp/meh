var
  http = require("http"),
  sys  = require("sys"),
  fs   = require("fs"),
  ws   = require("./vendor/ws"),
  fab  = require("./vendor/fab"),
  gad  = require("./vendor/gad"),

  app  = fab()
    (fab.listener)
    (gad.logger("access.log"))
    (/\/public\/(.+)/, gad.file_path('./public'))
    ('/', gad.file_path('./public/canvas.html'))
  (),

  game_server = ws.createServer(function (socket) {
    socket.addListener("connect", function (resource) {
      sys.puts("client connected from " + resource)
      socket.write("welcome\r\n")
    })
    socket.addListener("data", function (data) {
      socket.write(data)
    })
    socket.addListener("close", function () {
      sys.puts("client left the game")
    })
  })

http.createServer(app).listen(0xFAB) // 4011
game_server.listen(3840) // 3840

require("repl").start("> ")

