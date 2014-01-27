var SerialPort = require("serialport").SerialPort
var readline = require('readline');
var PortName = "/dev/ttyACM0";
var BaudRate = "9600";

var serialPort = new SerialPort(PortName, {
    baudrate: BaudRate //arser: serialPort.parsers.readline("\n")
}, false); // this is the openImmediately flag [default is true]

var receivedData = "";
var sendData = "";
var StartChar = "A";
var EndChar = "B";
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

serialPort.open(function() {
    console.log('open');

  serialPort.on('data', function(data) {
        console.log('data received: ' + data);
    });

   rl.question("Enter Manual Door Position", function(answer) {
        answer="P " + answer+"\n";
        console.log("Sending to Arduino",answer);
        //Serial Write function Test
        serialPort.write(new Buffer(answer,'utf-8'), function(err, results) {
            console.log('err ' + err);
            console.log('results ' + results);
        });
        rl.close();
    });
 serialPort.write(new Buffer('|P 150|\n','utf-8'), function(err, results) {
            console.log('err ' + err);
            console.log('results ' + results);
        });
        
        
        
});

serialPort.close(function() {
    console.log('close')});



