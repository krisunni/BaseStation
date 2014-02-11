var Serial = require("./service/Serial");
var express = require('express');
var url = require('url');
var Opt = Serial.Options;

/*var angular = require('./public/bower_components/angular/angular');
var Controllor = require('./public/script.js');*/


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

/*Debug Message when a user connects to socket*/
io.sockets.on('connection', function(socket) {
    console.log("user connected");
});