Streams twitter messages to web browsers in real time using web sockets.

This is part of some ongoing experiments with javascript and web sockets.
For more info see my [blog post][1] on the subject.

## Dependencies

NOTE that fab v3 has already been replaced by a new (and much better) API, and the v3 branch in the official repo has been removed. As a temporary workaround until I get around to porting to v4, I've forked fab and pushed v3 so it's still accessible.

* [node.js][2]
* [fab v3][3]
* [node.ws.js][4]
* [twitter-node][5]

## Usage

    $ user=NAME password=SECRET node server.js TERM1 .. TERMn
    $ open http://localhost:4011/

## Author

Copyright (c) 2010 Zack Hobson 

[1]: http://zackhobson.com/2010/03/28/node-js-and-web-sockets.html
[2]: http://github.com/ry/node
[3]: http://github.com/zenhob/fab/tree/v3
[4]: http://github.com/ncr/node.ws.js
[5]: http://github.com/technoweenie/twitter-node



