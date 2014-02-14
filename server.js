var Serial = require("./service/Serial");
var express = require('express');
var url = require('url');
var Opt = Serial.Options;
var SerialPort = require("serialport").SerialPort

var Options = {
    Command: 'ON',
    Term: '\n',
    Debug: 'False',
    Port: '/dev/ttyACM0',
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
server.listen(3000);
var ArdPort = '/dev/ttyACM0';
app.use(express.urlencoded());

/* Serve the /public dir */
app.use(express.static(__dirname + '/public'));



/* Write WebService*/
app.get('/write', function(req, res) {
    var url_parts = url.parse(req.url, true);
    var request = url_parts.query;
    //console.log(request.command);
    Write(request.command);
    res.send('<p> Command:' + request.command + ':Recieved</p>');
});

/* Write POST service*/

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
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

/* Call Serial Read and pass in the socket*/
Serial.Read({
    StartChar: '{',
    EndChar: '}'
}, io);


 Read();
/*Debug Message when a user connects to socket*/
io.sockets.on('connection', function(socket) {
    console.log("user connected");
     socket.emit('news', { hello: 'world' });
      socket.emit('message', { sendData: '{ArduinoReady}' });
  /*  Serial.Read({
    StartChar: '{',
    EndChar: '}'
}, io);*/
});



function Read() {
    io.emit('message', { sendData: '{Enterint this block}' });
    var receivedData = "";
    var sendData = "";
/*    var Status = AddTerminator('Hello', Options.Term);
*/    var Message;
    Options.Port = typeof Options.Port !== 'undefined' ? Options.Port : "/dev/ttyACM0"; // Set default Port
    Options.BaudRate = typeof Options.BaudRate !== 'undefined' ? Options.BaudRate : "9600"; // Set default BaudRate
    Options.StartChar = typeof Options.StartChar !== 'undefined' ? Options.StartChar : "{";
    Options.EndChar = typeof Options.EndChar !== 'undefined' ? Options.EndChar : "}";
    var serialPort = new SerialPort(Options.Port, {
        baudrate: Options.BaudRate,
        /*parser  : serial.parsers.readline( "\n" )*/
    }, false); // this is the openImmediately flag [default is true]

    serialPort.open(function() {
        //serialPort.write(Status);
        console.log('Read: Opening Serial Port');
        serialPort.on('data', function(data) {
            receivedData += data.toString();
            if (receivedData.indexOf(Options.StartChar) >= 0 && receivedData.indexOf(Options.EndChar) >= 0) {
                sendData = receivedData.substring(receivedData.indexOf(Options.StartChar) + 1, receivedData.indexOf(Options.EndChar));
                receivedData = '';

                console.log('Read: Read Data :sendData = ' + sendData.toString());
                io.emit("message", sendData);

            }

        });
    });
}



