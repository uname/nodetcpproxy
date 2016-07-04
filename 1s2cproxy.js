var net = require("net");
 
var LOG_DATA    = true;
var HEX_MODE    = true;

var LOCAL_ADDR  = "115.159.157.126";
var LOCAL_PORT  = 8087;

var client1;
var client2;
var counter = 0;

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

server.on("connection", 
    function(client) {
        console.log("client connected  " + client.remoteAddress + ":" + client.remotePort);
        if(counter == 0) {
            client1 = client
            console.log("1");
        } else if(counter == 1) {
            client2 = client

            client1.on("data", function(data) {
                    logData("client1 -> client2 :" + data2print(data));
                    client2.write(data);
                });
                
            client2.on("data", function(data) {
                    logData("client2 -> client1 :" + data2print(data));
                    client1.write(data);
                });
                
            client1.on("close", function() {
                console.log("client1 closed");
                client1.destroy();
                client2.destroy()
                counter = 0;
            });

            client2.on("close", function() {
                console.log("client2 closed");
                client2.destroy();
                client1.destroy();
                counter = 0;
            });
            
            client1.on("error", function() {
                console.log("client1 error");
                client1.destroy();
                client2.destroy();
                counter = 0;
            });

            client2.on("error", function() {
                console.log("client2 error");
                client2.destroy();
                client1.destroy();
                counter = 0;
            });
        }
        
        counter++;
    }
);
 
console.log("proxy server started on " + LOCAL_ADDR + ":" + LOCAL_PORT);
