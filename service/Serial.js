var SerialPort = require("serialport").SerialPort,
    fs = require('fs'),
    http = require('http'),
    socketio = require('socket.io'),
    url = require("url")

    /* function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}
 */
var debug = false;
var socketServer;

var Options = {
    Command: 'ON',
    Term: '\n',
    Debug: 'False',
    Port: '/dev/ttyUSB0',
    BaudRate: 9600,
    StartChar: '{',
    EndChar: '}',
};

function startServer() {
    function onRequest(request, response) {
        // parse the requested url into pathname. pathname will be compared
        // in route.js to handle (var content), if it matches the a page will 
        // come up. Otherwise a 404 will be given. 
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received");
        var content = route(handle, pathname, response, request, debug);
    }
    // on request event
    var httpServer = http.createServer(onRequest).listen(3001, function() {
        console.log("Socket Server Listening at: http://localhost:3001");
        console.log("Server is up");
    });
    Read(Options);
    initSocketIO(httpServer, debug);
}

function initSocketIO(httpServer, debug) {
    socketServer = socketio.listen(httpServer);
    socketServer.on('connection', function(socket) {
        console.log("user connected");
        socketServer.on('update', function(data) {
            socket.emit("UpdateClient", data);
        });

    });
}

function Start(Options) {
    Options.Port = typeof Options.Port !== 'undefined' ? Options.Port : "/dev/ttyACM0"; // Set default Port
    Options.BaudRate = typeof Options.BaudRate !== 'undefined' ? Options.BaudRate : "9600"; // Set default BaudRate
    Options.Command = typeof Options.Command !== 'undefined' ? Options.Command : "ON"; // Set default BaudRate
    Options.Term = typeof Options.Term !== 'undefined' ? Options.Command : "\n"; // Set default Terminator
    Options.Debug = typeof Options.Debug !== 'undefined' ? Options.Debug : "False"; // Set default Terminator
    var serialPort = new SerialPort(Options.Port, {
        baudrate: Options.BaudRate //arser: serialPort.parsers.readline("\n")
    }, true); // this is the openImmediately flag [default is true]
}

function Close(serialPort) {
    serialPort.close();
}

/* Write Serial commands */
function Write(Options) {
    Options.Port = typeof Options.Port !== 'undefined' ? Options.Port : "/dev/ttyUSB0"; // Set default Port
    Options.BaudRate = typeof Options.BaudRate !== 'undefined' ? Options.BaudRate : "9600"; // Set default BaudRate
    Options.Command = typeof Options.Command !== 'undefined' ? Options.Command : "ON"; // Set default BaudRate
    Options.Term = typeof Options.Term !== 'undefined' ? Options.Command : "\n"; // Set default Terminator
    Options.Debug = typeof Options.Debug !== 'undefined' ? Options.Debug : "False"; // Set default Terminator

    Options.Command = AddTerminator(Options.Command, Options.Term);
    // console.log("Write: Command Recieved" + Options.Command);
    var serialPort = new SerialPort(Options.Port, {
        baudrate: Options.BaudRate //arser: serialPort.parsers.readline("\n")
    }, true); // this is the openImmediately flag [default is true]

    // var serialPort =SerialOpen(Options,serialPort);
    serialPort.open(function() { //serialPort.on('data', function(data){});
        // console.log('Write: Opening Serial Port');
        // console.log('Write: Writing' + Options.Command);
        if (Options.Command !== 'undefined') {
            serialPort.write(Options.Command);
        }
        //console.log('Write: Closing Serial Write');
        //serialPort.close();

    });

    /*    function SerialOpen(Options) {
        var serialPort = new SerialPort(Options.Port, {
            baudrate: Options.BaudRate //arser: serialPort.parsers.readline("\n")
        }, true); // this is the openImmediately flag [default is true]
        return serialPort;
    }

    function SerialClose(SerialPort) {
        SerialPort.close();
    }*/
}

/* Read Serial commands */

function Read(Options) {
    console.log('Entering Read routing');
    var receivedData = "";
    var sendData = "";
    var Status = AddTerminator('Hello', Options.Term);
    var Message;
    Options.Port = typeof Options.Port !== 'undefined' ? Options.Port : "/dev/ttyUSB0"; // Set default Port
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
            }
            console.log('Read: :sendData = ' + sendData.toString());
            socketServer.emit("update", sendData);
            console.log('Sending Event');

        });
    });
}

function ReadForever(socket) {
    var PortName = "/dev/ttyACM0";
    var BaudRate = "9600";

    var serialPort = new SerialPort(PortName, {
        baudrate: BaudRate
    }, false);
    serialPort.open(function() {
        console.log('Opening Serial');

        serialPort.on('data', function(data) {
            // console.log('data received: ' + data);
            socket.emit("update", data.toString());
        });
    });
}

function Debugger(text) {
    if (debug === true) {
        console.log(text);
    }

}

function AddTerminator(Message, Term) {
    var Output = Message.concat(Term);
    return Output;
}

exports.Write = Write;
exports.Read = Read;
exports.Start = Start;
exports.Options = Options;
exports.AddTerminator = AddTerminator;
exports.ReadForever = ReadForever;
exports.start = startServer;