var Serial = require("./service/Serial");
var express = require('express');
var url = require('url');
var Opt = Serial.Options;
var SerialPort = require("serialport").SerialPort
var ArdPort = '/dev/ttyUSB0';
var ServerPort = 3000;
var Options = {
    Command: 'ON',
    Term: '\n',
    Debug: 'False',
    Port: '/dev/ttyUSB0',
    BaudRate: 9600,
    StartChar: '{',
    EndChar: '}',
};


var app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);
io.set('log level', 1);

app.use(express.compress());
server.listen(ServerPort);

app.use(express.urlencoded());

   var serialPort = new SerialPort(Options.Port, {
        baudrate: Options.BaudRate,

    }, false);
/* Serve the /public dir */
app.use(express.static(__dirname + '/public'));
/*Read();
 */


/* Write WebService*/
app.get('/write', function(req, res) {
    var url_parts = url.parse(req.url, true);
    var request = url_parts.query;
    //console.log(request.command);
    Write(request.command);
    res.send('<p> Command:' + request.command + ':Recieved</p>');
});

/* Write POST service*/

app.configure('development', function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.post('/write', function(req, res) {
    console.log(req.body.data);
    res.send('<p>200 OK</p>');
    Write(req.body.data);
});

/*Serial Write module wrapper*/
function Write(data) {
    Serial.Write({
        Command: data,
        Debug: 'False',
        Port: ArdPort,
    });
}

/*io.sockets.on('disconnect', function(socket) {
        console.log('User Disconncted, Termination Serial Port');
        serialPort.close();
});
*/

io.sockets.on('update', function(data) {
    console.log("Recived update event|||||||");
    console.log(data);
});

//Debug Message when a user connects to socket
io.sockets.on('connection', function(socket) {
    console.log("User Connected");
    var receivedData = "";
    var sendData = "";
    var Message;
    Options.Port = typeof Options.Port !== 'undefined' ? Options.Port : "/dev/ttyUSB0"; // Set default Port
    Options.BaudRate = typeof Options.BaudRate !== 'undefined' ? Options.BaudRate : "9600"; // Set default BaudRate
    Options.StartChar = typeof Options.StartChar !== 'undefined' ? Options.StartChar : "{";
    Options.EndChar = typeof Options.EndChar !== 'undefined' ? Options.EndChar : "}";
   /* 
   var serialPort = new SerialPort(Options.Port, {
        baudrate: Options.BaudRate,

    }, false);
*/
    serialPort.open(function() {
        serialPort.on('data', function(data) {
            receivedData += data.toString();
            console.log(receivedData);
            if (receivedData.indexOf(Options.StartChar) >= 0 && receivedData.indexOf(Options.EndChar) >= 0) {
                sendData = receivedData.substring(receivedData.indexOf(Options.StartChar) + 1, receivedData.indexOf(Options.EndChar));
                receivedData = '';

            }
            console.log(sendData);
            socket.emit("update", sendData);

        });
    });
});

/*Serial.start();

var socketclient = require('socket.io-client');
var ClientSocket = socketclient.connect('pi.ku:3001', {reconnect: true});
ClientSocket.on('connect', function() { 
    //console.log('Connected!');


});
ClientSocket.on('event', function(data) {
    console.log("Recived message event|||||||");
    console.log(data);
});
*/
