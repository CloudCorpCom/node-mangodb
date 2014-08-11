var fs = require('fs');
var net = require('net');
var MANGODB_DURABLE = process.env.MANGODB_DURABLE || false;
var MANGODB_EVENTUAL = process.env.MANGODB_EVENTUAL || false;
var devnull = fs.createWriteStream('/dev/null');
var devrandom = fs.createReadStream('/dev/urandom',{encoding:"base64"});
var server = net.createServer().listen(27017);
server.on("connection",function(sock) {
    sock.write('HELLO\r\n');
    sock.on("data",function(data) {
        var command = data.toString().trim().split(' ')[0];
        var response = MANGODB_EVENTUAL ? 42 : devrandom.read(1024);
        if(command==="BYE") return sock.end("");
        if(command==="WAIT") return process.nextTick(function(){});
        devnull.write(data);
        sock.write("OK"+response+"\r\n");
    });
});
console.log("Starting MangoDB on port 27017");
