var Serial = require("./Serial")
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

app.use(require('connect').bodyParser());
server.listen(3000);

app.get('/', function(req, res)
{
    res.sendfile(__dirname + '/index.html');
});
app.post('/write', function(req, res)
{
    console.log(req.body);
    res.send('<p>Thank you</p>')
    //Write(req.body.data);
});

function Write(data)
{
    Serial.Write(
    {
        Command: data
    });
}
io.sockets.on('connection', function(socket)
{

    socket.on('Write', function(data)
    {
        console.log(data);
        Serial.Write(
        {
            Command: data
        });
    });

    socket.on('message', function(message)
    {
        console.log("Got message: " + message);
        io.sockets.emit('pageview',
        {
            'url': message
        });
    });

});
