var SerialPort = require("serialport").SerialPort
var debug= false;

var Options = {
    Command: 'ON',
    Term: '\n',
    Debug: 'False',
    Port: '/dev/ttyACM0',
    BaudRate: 9600,
    StartChar: '{',
    EndChar: '}',
};

function Start(Options)
{   Options.Port = typeof Options.Port !== 'undefined' ? Options.Port : "/dev/ttyACM0"; // Set default Port
    Options.BaudRate = typeof Options.BaudRate !== 'undefined' ? Options.BaudRate : "9600"; // Set default BaudRate
    Options.Command = typeof Options.Command !== 'undefined' ? Options.Command : "ON"; // Set default BaudRate
    Options.Term = typeof Options.Term !== 'undefined' ? Options.Command : "\n"; // Set default Terminator
    Options.Debug = typeof Options.Debug !== 'undefined' ? Options.Debug : "False"; // Set default Terminator
    var serialPort = new SerialPort(Options.Port, {
        baudrate: Options.BaudRate //arser: serialPort.parsers.readline("\n")
    }, true); // this is the openImmediately flag [default is true]
}
function Close (serialPort)
{
     serialPort.close();
}

/* Write Serial commands */
function Write(Options) {
    Options.Port = typeof Options.Port !== 'undefined' ? Options.Port : "/dev/ttyACM0"; // Set default Port
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
        console.log('Write: Opening Serial Port');
        console.log('Write: Writing' + Options.Command);
        serialPort.write(Options.Command);
        console.log('Write: Closing Serial Write');
        serialPort.close();
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

function Read(Options,socket) {
    var receivedData = "";
    var sendData = "";
    var Status = AddTerminator('Hello', Options.Term);
    var Message;
    Options.Port = typeof Options.Port !== 'undefined' ? Options.Port : "/dev/ttyACM0"; // Set default Port
    Options.BaudRate = typeof Options.BaudRate !== 'undefined' ? Options.BaudRate : "9600"; // Set default BaudRate
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
                //console.log('This block is executed');
                console.log('Read: Read Data :sendData = ' + sendData.toString());
                Message = sendData.toString();
                socket.emit( "message", sendData.toString() );
            }
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
            socket.emit( "message", data.toString() );
        });
    });
}
function Debugger(text)
{
    if (debug===true)
    {
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
exports.Options =Options;

exports.ReadForever = ReadForever;