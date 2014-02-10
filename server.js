var Serial = require("./service/Serial");
var express = require('express');
var url = require('url');

/*var angular = require('./public/bower_components/angular/angular');
var Controllor = require('./public/script.js');*/


var app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);
app.use(express.compress());
server.listen(3000);
var ArdPort = '/dev/ttyACM0';
app.use(express.urlencoded());
/*app.listen(3000);*/

/* Serve the /public dir */
app.use(express.static(__dirname + '/public'));



/* Write WebService*/
app.get('/write', function(req, res) {
    var url_parts = url.parse(req.url, true);
    var request = url_parts.query;
    console.log(request.command);
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

/* Read WebService*/

io.set('log level', 1);


io.sockets.on("connection", function(socket) {
 /* Serial.Read({
        StartChar: '{',
        EndChar: '}'
    }, socket);*/
    Serial.ReadForever(socket);
/*
    socket.emit('news', {
        hello: 'world'
    });
    socket.on('my other event', function(data) {
        console.log(data);
    });*/
});

app.get('/read', function(req, res) {
    /*var url_parts = url.parse(req.url, true);
    var request = url_parts.query;
    console.log(request);
    console.log(request.command);*/
    console.log('Raw console output' + Serial.Read({
        StartChar: '{',
        EndChar: '}'
    }));
    var data = Serial.Read({
        StartChar: '{',
        EndChar: '}'
    });
    console.log('This is Server: Value of Data is ' + data);
    res.send('<p>' + data + '<p>');
});




/* Serial Read module wrapper*/

function Read(data) {
    data = Serial.Read({
        StartChar: '{',
        EndChar: '}',
        Port: ArdPort,
    });
}