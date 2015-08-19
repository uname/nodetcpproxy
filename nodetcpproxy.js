var net = require("net");
 
var LOG_DATA    = true;
var HEX_MODE    = true;

var LOCAL_ADDR  = "0.0.0.0";
var LOCAL_PORT  = 8080;
var REMOTE_ADDR = "192.168.45.133";
var REMOTE_PORT = 22;
 
var server = net.createServer();
server.listen(LOCAL_PORT, LOCAL_ADDR);

data2print = function(data)
{
    if(!HEX_MODE) {
        return data.toString();
    }
    
    var hexStr = data.toString("hex")
    var outStr = "";
    for(var i in hexStr) {
        if(i % 2 == 0) {
            outStr += " "
        }
        if(i % 32 == 0) {
            outStr += "\n>>  ";
        }
        outStr = outStr + hexStr[i];
    }
    
    return outStr
}

logData = function(data)
{
	if(LOG_DATA) {
		console.log(data)
	}
}

server.on("connection", function(client)
{
    console.log("Client connected  " + client.remoteAddress + ":" + client.remotePort);
    var proxySocket = new net.Socket();
    proxySocket.connect(REMOTE_PORT, REMOTE_ADDR, function() {
        logData("Connected to remote -> " + REMOTE_ADDR + ":" + REMOTE_PORT);
    });
    
    proxySocket.on("close", function(data) {
        console.log("Remote closed");
        client.destroy();
    });
    
    proxySocket.on("data", function(data) {
        logData("Remote -> Proxy -> Client:\n" + data2print(data));
        client.write(data);
    });
    
    client.on("close", function(data) {
        console.log("Client closed");
        proxySocket.destroy();
    });

	client.on("error", function() {
		console.log("**Client error");
		proxySocket.destroy();
	});
    
    client.on("data", function(data) {
       logData("Client -> Proxy -> Remote:\n" + data2print(data));
       proxySocket.write(data);
    });
    
});
 
console.log("TCP proxy server started on " + LOCAL_ADDR + ":" + LOCAL_PORT);
