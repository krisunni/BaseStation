var Serial = require("./service/Serial");
var express = require('express');
var url = require('url');
/*var angular = require('./public/bower_components/angular/angular');
var Controllor = require('./public/script.js');*/


var app = express();
var ArdPort = '/dev/ttyACM1';
app.use(express.urlencoded());
app.listen(3000);

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

/* Read WebService*/
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
/* Serial Read module wrapper*/

function Read(data) {
    data = Serial.Read({
        StartChar: '{',
        EndChar: '}',
        Port: ArdPort,
    });
}