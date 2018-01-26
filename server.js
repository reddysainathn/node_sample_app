var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var net = require('net');
var Database = require('better-sqlite3');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

function getData() {
    var db = new Database('foobar.db', memory = true);
    db.prepare('CREATE  TABLE  IF NOT EXISTS lorem (info TEXT)').run();
    //db.prepare('delete from  lorem').run();
}
// var db = new Database('foobar.db', memory = true);
// db.prepare('CREATE  TABLE  IF NOT EXISTS lorem (info TEXT)').run();
// db.prepare('delete from  lorem').run();
// var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
// for (var i = 0; i < 10; i++) {
//     stmt.run("Ipsum " + i);
// }


app.listen(port);
console.log('Server started! At http://localhost:' + port);

///////1------
app.post('/api/encryptInput', function (req, res) {
    var response = {
        "actual_String": req.body.textValue,
        "Encrypted_String": bcrypt.hashSync(req.body.textValue, 10)
    }
    res.send(response);
});
/////////3------
app.get('/api/getAllData', function (req, res) {
    var db = new Database('foobar.db', memory = true);
    var stmt1 = db.prepare('SELECT * FROM lorem');
    var arr = [];
    for (var row of stmt1.iterate()) {
        arr.push(row)
    }
    db.close();
    res.send(arr);
});

/////2-------
app.get('/api/sendPacket/:getData', function (req, res) {
    var data1 = req.params.getData;
    var server = net.createServer(function (socket) {
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
        client.destroy(); 
    });
    client.on('close', function () {
        console.log('Connection closed');
    });
    var db = new Database('foobar.db', memory = true);
    var stmt = db.prepare('INSERT INTO lorem VALUES (?)').run(data1);
    var stmt1 = db.prepare('SELECT * FROM lorem where info=(?)').get(data1);
    db.close();
    res.send(stmt1);
});