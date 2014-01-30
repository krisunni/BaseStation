var Serial = require("./service/Serial");
var express = require('express');
var url = require('url');

var app = express();
var ArdPort = '/dev/ttyACM0';
app.use(express.urlencoded());
app.listen(3000);

/* ServiceStaticPage */
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});
app.get('/angularjs', function(req, res) {
    res.sendfile(__dirname + '/bower_components/index.html');
});
/* Write WebService*/
app.get('/write', function(req, res) {
    var url_parts = url.parse(req.url, true);
    var request = url_parts.query;
    console.log(request.command);
    Write(request.command);
    res.send('<p>Thank you</p>');
});

app.get('/angular', function(req, res) {
    res.sendfile(__dirname + '/public/bower_components/angular/angular.js');
});
app.get('/script', function(req, res) {
    res.sendfile(__dirname + '/public/script.js');
});
app.get('/protractorTest', function(req, res) {
    res.sendfile(__dirname + '/public/protractorTest.js');
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