/*
 * Copyright 2015 Alexander Pustovalov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require('babel-register');
//var io = require('socket.io');
var controller = require('../../src/server/controller.js');

process.on('uncaughtException',
    function(err){
        if(err.code === 'EADDRINUSE'){
            console.error('Port is already in use, you can precise one with -p YOUR_PORT.');
        } else {
            console.log(err);
        }
    }
);

var portNumber = 2222;
var workingDir = '/Volumes/Development/projects/structor/structor-github-boilerplates/bootstrap-prepack-probe';
var serverDir = '/Volumes/Development/projects/structor/structor-github/structor';

controller.initServer({ serverDir: serverDir, projectDir: workingDir, portNumber: portNumber});
