//Importing all dependencies
//express -> Web Framework popular for NodeJS RESTFul calls
//bcrypt --> Multiple Hashing mechanism protocol(Popular for Password Hashing) 
//net --> A nodeJS library which has defined network relative features.
//bodyparser--> It is used for JSON parsing
//better-sqlite3 --> Alternative for sqlite nodejs library
var express = require('express');
var app = express();
var port = process.env.PORT || 443;
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var net = require('net');
var Database = require('better-sqlite3');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// Creating Database connection on Load.
const db = new Database('socketDB.db', memory = true);
db.prepare('CREATE  TABLE  IF NOT EXISTS socketTable (apiInput TEXT)').run();
function getData() {
    //Create a table if not exisits in database.
    
    //db.prepare('delete from  lorem').run();
}
// Open the server Port, so we can access REST API
app.listen(port);
console.log('Server started! At http://localhost:' + port);
// 1. Ecryping input string as POST call with JSON response
app.post('/api/encryptInput', function (req, res) {
    var response = {
        "actual_String": req.body.textValue,
        "Encrypted_String": bcrypt.hashSync(req.body.textValue, 10)
    }
    res.send(response);
});

var HOST = '127.0.0.1';
var PORT = 6969;
//Create a new instance with different port which can act as Socket communication server.
net.createServer(function (sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function (data) {

        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // Write the data back to the socket, the client will receive it as data from the server
        sock.write('You said "' + data + '"');

    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function (data) {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

}).listen(PORT, HOST);
console.log('Server listening on ' + HOST + ':' + PORT);

//2.Sending Pakcet over TCP/IP from Input GET REST call.
app.get('/api/sendPacket/:getData', function (req, res) {
    var data1 = req.params.getData;

    var client = new net.Socket();
    client.connect(PORT, HOST, function () {

        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
        client.write(data1);
        //After write to the server insert the record to sqlite.
        var stmt1 = db.prepare('INSERT INTO socketTable VALUES (?)');
        stmt1.run(data1);
        //db.close();
    });

    // Add a 'data' event handler for the client socket
    // data is what the server sent to this socket
    client.on('data', function (data1) {
        console.log('DATA: ' + data1);
        // Close the client socket completely
        client.destroy();

    });

    // Add a 'close' event handler for the client socket
    client.on('close', function () {
        console.log('Connection closed');
    });
    res.send(data1);
});

// 3.Get All records from Database.(Input record from Task 2 can be seen in this.)
app.get('/api/getAllData', function (req, res) {
    var stmt1 = db.prepare('SELECT * FROM socketTable');
    var arr = [];
    for (var row of stmt1.iterate()) {
        arr.push(row)
    }
    //db.close();
    res.send(arr);
});