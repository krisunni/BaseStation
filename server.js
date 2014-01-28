/*var SerialPort = require("serialport").SerialPort
var Serial = require("./service/Serial")

Serial.Write(
{
    Command: 'P 150'
});
*/

var Serial = require("./service/Serial")
var express = require('express');
var url  = require('url');

var app = express();

app.use(express.urlencoded())
app.listen(3000);

app.get('/', function(req, res)
{
    res.sendfile(__dirname + '/public/index.html');
});

/* URL Manual Override*/
app.get('/write', function(req, res)
{   var url_parts = url.parse(req.url, true);
   var request = url_parts.query;
    console.log(request);
    console.log(request.command);
    Write(request.command);
    res.send('<p>Thank you</p>')
});
app.post('/write', function(req, res)
{
    console.log(req.body.data);
    res.send('<p>Thank you</p>')
    Write(req.body.data);
});


function Write(data)
{
    Serial.Write(
    {
        Command: data
    });
}