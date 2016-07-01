var net = require("net");
 
var LOG_DATA    = true;
var HEX_MODE    = true;

var SERVER1_ADDR  = "127.0.0.1";
var SERVER1_PORT  = 8082; //4444;
var SERVER2_ADDR  = "127.0.0.1"; //"115.159.157.126";
var SERVER2_PORT  = 8081; //22;

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

var client1 = new net.Socket();
var client2 = new net.Socket();

client1.connect(SERVER1_PORT, SERVER1_ADDR, function() {
        logData("Connect server1 -> " + SERVER1_ADDR + ":" + SERVER1_PORT + " OK");
    });
client2.connect(SERVER2_PORT, SERVER2_ADDR, function() {
        logData("Connect server2 -> " + SERVER2_ADDR + ":" + SERVER2_PORT + " OK");
    });
    
client1.on("data", function(data) {
        logData("client1 -> client2 :\n" + data2print(data));
        client2.write(data);
    });
    
client2.on("data", function(data) {
        logData("client2 -> client1 :\n" + data2print(data));
        client1.write(data);
    });
    
client1.on("close", function() {
    console.log("client1 closed");
    client1.destroy();
    client2.destroy()
});

client2.on("close", function() {
    console.log("client2 closed");
    client2.destroy();
    client1.destroy()
});

client1.on("error", function() {
    console.log("client1 error");
    client1.destroy();
    client2.destroy();
});

client2.on("error", function() {
    console.log("client2 error");
    client2.destroy();
    client1.destroy();
});
