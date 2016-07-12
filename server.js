var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var osc = require('osc-min');
var dgram = require('dgram');

var remoteIp = '127.0.0.1';
var remotePort = 3333;

var udp = dgram.createSocket('udp4');

/*
 using ip 192.168.1.150 .. change this for your setup
  in this file as well as index.html
  if you're using your browser locally this can be set to localhost
 */

server.listen(3000);

sendHeartbeat = function(x, y) {
  var buf;
  buf = osc.toBuffer({
    address: "/wek/inputs",
    args: [
      { type: "float", value: x },
      { type: "float", value: y },
      { type: "float", value: Math.random() }
    ]
  });
  return udp.send(buf, 0, buf.length, remotePort, "192.168.1.150");
};

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('mouseMoveEvent', function (data) {
    console.log(data);
    sendHeartbeat(data.x, data.y);
  });
});


