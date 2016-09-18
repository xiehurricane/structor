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

// import path from 'path';
import express from 'express';
import multer from 'multer';
import {isArray} from 'lodash';

import * as config from '../commons/configuration.js';
import * as publishManager from './publishManager';

let serverRef;

export function loopback(options){
    return Promise.resolve('Response: ' + options.message);
}

export function error(options){
    return Promise.reject('Response: ' + options.message);
}

export function setServer(server){
    serverRef = server;
    if(serverRef){
        const sandboxDirPath = config.sandboxDirPath();
        serverRef.app.use('/structor-sandbox-preview', express.static(sandboxDirPath));
        const screenshotStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, sandboxDirPath);
            },
            filename: (req, file, cb) => {
                cb(null, 'screenshot.png');
            }
        });
        const upload = multer({storage: screenshotStorage});
        serverRef.app.post('/structor-sandbox-screenshot', upload.single('screenshot'), (req, res, next) => {
            //console.log(req.file);
            res.status(204).end();
        });
    }
}

export function readComponentSources(options){
    return publishManager.readComponentSources(options.componentName, options.model);
}

export function publishGenerator(options){
    return publishManager.publishGenerator(options.generatorKey, options.dataObject);
}
