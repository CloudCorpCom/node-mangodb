var config = require('config');
var fs = require('fs');
var net = require('net');

var devnull = fs.createWriteStream('/dev/null');
var server = net.createServer();
server.listen(config.port);

console.log("MangoDB server listening on "+config.port);

server.on("connection",function(sock) {
    var byteCount = 0;
    console.log("Connection: "+sock.remoteAddress+":"+sock.remotePort);
    
    sock.on("data",function(data) {
        byteCount += data.length;
        devnull.write(data);
    });

    sock.on("end", function() {
        console.log("Connection closed: "+byteCount);
    });
        
});

