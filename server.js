/*

var http = require("http");
function start() {
  function onRequest(request, response) {
    console.log("Request received.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    SerialRead();
 response.write("Hello World");
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;

*/


var SerialPort = require("serialport").SerialPort

var serialPort = new SerialPort("/dev/ttyACM0",{baudrate: 9600}, false); // this is the openImmediately flag [default is true]

    serialPort.open(function () 
    {
      console.log('open');
      serialPort.on('data', function(data) {
      console.log('data received: ' + data);
    });
      serialPort.write("ls\n", function(err, results) {
        console.log('err ' + err);
        console.log('results ' + results);
      });
    });


