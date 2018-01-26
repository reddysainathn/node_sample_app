var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var net = require('net');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var Database = require('better-sqlite3');
var db = new Database('foobar.db', memory = true);
db.prepare('CREATE  TABLE  IF NOT EXISTS lorem (info TEXT)').run();
db.prepare('delete from  lorem').run();
var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
for (var i = 0; i < 10; i++) {
    stmt.run("Ipsum " + i);
}
var stmt1 = db.prepare('SELECT * FROM lorem');
var arr = [];
for (var row of stmt1.iterate()) {
    arr.push(row)
}

app.listen(port);
console.log('Server started! At http://localhost:' + port);
//////////1
app.post('/api/encryptInput', function (req, res) {
    var response = {
        "actual_String": req.body.textValue,
        "Encrypted_String": bcrypt.hashSync(req.body.textValue, 10)
    }
    res.send(response);
});
/////////3
app.get('/api/getAllData', function (req, res) {
    res.send(arr);
});

/////2
app.get('/api/sendPacket/:getData', function (req, res) {
    var server = net.createServer(function (socket) {
        var data1 = req.params.getData;
        socket.write(data1);
        socket.pipe(socket);
    });
    server.listen(1337, '127.0.0.1');
    var client = new net.Socket();
    client.connect(1337, '127.0.0.1', function () {
        console.log('Connected');
        client.write('Hello, server! Love, Client.');
    });
    client.on('data', function (data) {
        console.log('Received: ' + data);
        client.destroy(); // kill client after server's response
    });
    client.on('close', function () {
        console.log('Connection closed');
    });
    res.send("Success!");
});

db.close();