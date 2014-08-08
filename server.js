var config = require('config');
var fs = require('fs');
var net = require('net');

var devnull = fs.createWriteStream('/dev/null');
var server = net.createServer();
server.listen(config.port);

console.log("MangoDB server listening on "+config.port);

server.on("connection",function(sock) {
    var byteCount = 0;
    var clientInfo = sock.remoteAddress+":"+sock.remotePort;
    console.log("Connection: "+clientInfo);
    sock.write('HELLO\r\n');
    
    sock.on("data",function(data) {
        var cmd_bits = data.toString('utf8').trim().split(' ');
        var cmd = cmd_bits[0];
        if(cmd==="BYE") {
            return sock.end("BYE "+byteCount+"\r\n");
        }
        if(cmd==="WAIT") {
            console.log("Waiting?");
        }
        if(cmd_bits.length>0) {
            byteCount += data.length;
            devnull.write(data);
            sock.write("OK "+data.length+"\r\n");
        }
    });

    sock.on("end", function() {
        console.log("Connection closed: "+clientInfo+" "+byteCount);
    });
        
});

