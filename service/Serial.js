var SerialPort = require("serialport").SerialPort
var Options = {
    Command: 'ON',
    Term: '\n',
    Debug: 'False',
    Port: '/dev/ttyACM0',
    BaudRate: 9600,
    StartChar: '{',
    EndChar: '|',
};



function Write(Options)
{
    Options.Port = typeof Options.Port !== 'undefined' ? Options.Port : "/dev/ttyACM0"; // Set default Port
    Options.BaudRate = typeof Options.BaudRate !== 'undefined' ? Options.BaudRate : "9600"; // Set default BaudRate
    Options.Command = typeof Options.Command !== 'undefined' ? Options.Command : "ON"; // Set default BaudRate
    Options.Term = typeof Options.Term !== 'undefined' ? Options.Command : "\n"; // Set default Terminator
    Options.Debug = typeof Options.Debug !== 'undefined' ? Options.Debug : "False"; // Set default Terminator

    Options.Command = AddTerminator(Options.Command, Options.Term);
    var serialPort = new SerialPort(Options.Port,
    {
        baudrate: Options.BaudRate //arser: serialPort.parsers.readline("\n")
    }, false); // this is the openImmediately flag [default is true]

    serialPort.open(function()
    {
        console.log('Opening Serial Port');
        console.log('Writing' + Options.Command);
        serialPort.write(Options.Command);
        console.log('Closing Serial Write');
        serialPort.close();
    });
}

function Read(Options)
{
    var receivedData = "";
    var sendData = "";

    Options.Port = typeof Options.Port !== 'undefPined' ? Options.Port : "/dev/ttyACM0"; // Set default Port
    Options.BaudRate = typeof Options.BaudRate !== 'undefined' ? Options.BaudRate : "9600"; // Set default BaudRate
    var serialPort = new SerialPort(Options.Port,
    {
        baudrate: Options.BaudRate //parser: serialPort.parsers.readline("\n")
    }, false); // this is the openImmediately flag [default is true]

    serialPort.open(function()
    {
        serialPort.on('data', function(data)
        {
            receivedData += data.toString();
            if (receivedData.indexOf(Options.StartChar) >= 0 && receivedData.indexOf(Options.EndChar) >= 0)
            {
                sendData = receivedData.substring(receivedData.indexOf(Options.StartChar) + 1, receivedData.indexOf(Options.EndChar));
                receivedData = '';
                return sendData;
            }
        });
    });
}

function ReadForever()
{
    var PortName = "/dev/ttyACM0";
    var BaudRate = "9600";

    var serialPort = new SerialPort(PortName,
    {
        baudrate: BaudRate
    }, false);
    serialPort.open(function()
    {
        console.log('Opening Serial');

        serialPort.on('data', function(data)
        {
            console.log('data received: ' + data);
        });
    });
}

function AddTerminator(Message, Term)
{
    var Output = Message.concat(Term);
    return Output;
}

exports.Write = Write;
exports.Read = Read;
exports.ReadForever = ReadForever;