// usage: env user=USER password=PASSWORD node server.js <term1> <term2>
var
  http = require("http"),
  sys  = require("sys"),
  fs   = require("fs"),
  ws   = require("./vendor/ws"),
  fab  = require("./vendor/fab"),
  gad  = require("./vendor/gad"),
  tn   = require("./vendor/twitter-node"),

  app  = fab()
    (fab.listener)
    (gad.logger("access.log"))
    ('/public', fab.fs('./public')) 
    ('/', function (back) {
      return function (req) {
        fs.readFile('./public/canvas.html', 'utf8', function(err, data) {
          if (err) throw err
          back({body: data, header: {content_type: 'text/html'}})()
        })
      }
    })
  (),

  client_sockets = {},
  client_count   = 0,

  game_server = ws.createServer(function (socket) {
    var socket_id = "client" + client_count
    client_sockets[socket_id] = socket
    client_count += 1

    socket.addListener("connect", function (resource) {
      sys.puts("client " + socket_id + " connected from " + resource)
    })
    socket.addListener("data", function (data) {
      sys.puts("client sent " + sys.inspect(data))
    })
    socket.addListener("close", function () {
      delete client_sockets[socket_id]
      sys.puts("client left the session")
    })
  }),

  twitter = new tn.TwitterNode({
    user: process.env['user'],
    password: process.env['password'],
    track: ['ipad']
  })

http.createServer(app).listen(0xFAB) // 4011
game_server.listen(3840) // 3840
twitter.addListener('tweet', function (tweet) {
  //sys.puts("got " + sys.inspect(tweet.text) + " from stream")
  for (socket_id in client_sockets) {
    if (client_sockets[socket_id]) {
      client_sockets[socket_id].write(tweet.text)
    }
  }
})
.addListener('close', function (response) {
  sys.puts('twitter connection closed.')
  sys.puts(sys.inspect(response))
}).stream()

require("repl").start("> ")

