/*var SerialPort = require("serialport").SerialPort
var Serial = require("./service/Serial")

Serial.Write(
{
    Command: 'P 150'
});
*/

var io = require ("socket.io");
var socket = io.connect('http://localhost:3000');
 socket.on('news', function (data) {
    console.log(data);
    socket.emit('news', { my: 'data' });
  });