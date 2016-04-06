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

import _ from 'lodash';
import express from 'express';
import rewrite from 'express-urlrewrite';
import path from 'path';
import bodyParser from 'body-parser';
import httpProxy from 'http-proxy';

import * as config from './commons/configuration.js';
import * as fileManager from './commons/fileManager.js';

import * as structorController from './structor/controller.js';
import * as sandboxController from './sandbox/controller.js';

let server = {
    io: undefined,
    ioSocket: undefined,
    ioSocketClient: undefined,
    app: undefined,
    appServer: undefined,
    proxy: undefined
};

function printError(message, error){
    if(message){
        console.log(message);
    }
    console.error(error.message ? error.message : error);
}

function callControllerMethod(controller, req, res){
    let methodName = req.body.methodName;
    let data = req.body.data || {};
    controller[methodName](data)
        .then( response => {
            if(response === undefined){
                response = null;
            }
            res.send({ data: response });
        })
        .catch( err => {
            let errorMessage = err.message ? err.message : err.toString();
            res.send({ error: true, errors: [errorMessage] });
        });
}

export function initServer(options){
    const { serverDir, projectDir, portNumber, io } = options;
    return config.init(serverDir, projectDir)
        .then(status => {
            if(status){

                server.app = express();
                server.app.use('/structor', express.static(path.join(config.serverDir(), 'static')));

                server.app.post('/invoke', bodyParser.json({limit: '50mb'}), (req, res) => {
                    callControllerMethod(structorController, req, res);
                });
                server.app.post('/sandbox', bodyParser.json({limit: '50mb'}), (req, res) => {
                    callControllerMethod(sandboxController, req, res);
                });

                server.appServer = server.app.listen(portNumber, () => {
                    console.log('Structor is ready to work');
                    if(status === config.READY){
                        console.log(`Open address: http://localhost:${portNumber}/structor in the browser.`);
                    } else if(server.status === config.EMPTY){
                        console.log(`Open address: http://localhost:${portNumber}/structor in the browser and download a Structor project from Structor Market.`)
                    }
                    if(io){
                        server.ioSocket = io(server.appServer);
                        server.ioSocket.on('connection', socket => {
                            server.ioSocketClient = socket;
                            server.ioSocketClient.emit('invitation', 'Hello from server.');
                        });
                    }
                });

                structorController.setServer(server);
                sandboxController.setServer(server);

            }
        }).catch(e => {
            printError('Error happened during server initialization:', e);
        });
}
