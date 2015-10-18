#!/usr/bin/env node
var minimist = require('minimist');
var path = require('path');
var io = require('socket.io');
var api = require('./server/api.js');

process.on('uncaughtException',
    function(err){
        if(err.code === 'EADDRINUSE'){
            console.error('Port is already in use.');
        } else {
            console.log(err);
        }
    }
);

var argv = minimist(process.argv.slice(2));
//console.log(JSON.stringify(argv, null, 4));

var portNumber = 2222;
if(argv['p']){
    var tryPort = parseInt(argv['p']);
    if(tryPort && tryPort > 1024 && tryPort < 65000){
        portNumber = tryPort;
    }
}

var workingDir = process.cwd();
if(argv['d']){
    if(path.isAbsolute(argv['d'])){
        workingDir = argv['d'];
    } else {
        workingDir = path.resolve(workingDir, argv['d']);
    }
}
console.log('Working dir: ' + workingDir);
console.log('Current dir: ' + __dirname);
console.log('Port number: ' + portNumber);

api.initServer({ dirname: __dirname, workingDirname: workingDir, portNumber: portNumber, io: io });