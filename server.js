var
  http = require("http"),
  sys  = require("sys"),
  fs   = require("fs"),
  net  = require("net"),
  fab  = require("./vendor/fab"),
  gad  = require("./vendor/gad"),

  app  = fab()
    (fab.listener)
    (gad.logger("access.log"))
    (/\/public\/(.+)/, gad.file_path('./public'))
    ('/', gad.file_path('./public/canvas.html'))
  (),

  game_server = net.createServer(function (socket) {
    socket.setEncoding("utf8")
    socket.setNoDelay(true)
    socket.addListener("connect", function () {
      socket.write("joined the game\r\n")
    })
    socket.addListener("data", function (data) {
      socket.write(data)
    })
    socket.addListener("end", function () {
      socket.write("left the game\r\n")
    })
  })

http.createServer(app).listen(0xFAB) // 4011
game_server.listen(0xDEAD) // 3840

require("repl").start("> ")

