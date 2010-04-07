// usage: env user=USER password=PASSWORD node server.js <term1> <term2>
var
  http = require("http"),
  sys  = require("sys"),
  fs   = require("fs"),
  ws   = require("./vendor/ws"),
  fab  = require("./vendor/fab"),
  tn   = require("./vendor/twitter-node"),

  app  = fab()
    (fab.listener)
    ('/public', fab.fs('./public')) 
    ('/', function (back) {
      return function (req) {
        fs.readFile('./public/index.html', 'utf8', function(err, data) {
          if (err) throw err
          back({body: data, header: {content_type: 'text/html'}})()
        })
      }
    })
  (),

  terms = process.ARGV.slice(2),

  twitter = new tn.TwitterNode({
    user: process.env['user'],
    password: process.env['password'],
    track: terms
  }),

  client_sockets = {},
  client_count   = 0,
  count1 = 0, count2 = 0,

  game_server = ws.createServer(function (socket) {
    var socket_id = "client" + client_count
    client_sockets[socket_id] = socket
    client_count += 1

    socket.addListener("connect", function (resource) {
      sys.puts("client " + socket_id + " connected from " + resource)
      socket.write(JSON.stringify({message:'welcome!', terms:terms,
        term1:count1, term2:count2}))
    })
    socket.addListener("data", function (data) {
      //sys.puts("client sent " + sys.inspect(data))
      for (sid in client_sockets) {
        if (client_sockets[sid]) {
          client_sockets[sid].write(JSON.stringify({message:socket_id + ": " + data}))
          //sys.puts("sent " + json)
        }
      }
    })
    socket.addListener("close", function () {
      delete client_sockets[socket_id]
      sys.puts("client left the session")
    })
  })

http.createServer(app).listen(0xFAB) // 4011
game_server.listen(3840) // 3840
twitter.addListener('tweet', function (tweet) {
  //sys.puts("got " + sys.inspect(tweet.text) + " from stream")
  for (socket_id in client_sockets) {
    if (tweet.text.match(terms[0])) { count1++ }
    if (tweet.text.match(terms[1])) { count2++ }
    if (client_sockets[socket_id]) {
      var json = JSON.stringify({'term1':count1,'term2':count2})
      client_sockets[socket_id].write(json)
      //sys.puts("sent " + json)
    }
  }
})
.addListener('close', function (response) {
  sys.puts('twitter connection closed.')
  sys.puts(sys.inspect(response))
}).stream()

require("repl").start("> ")

