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
import express from 'express';
import rewrite from 'express-urlrewrite';
import * as config from '../commons/configuration.js';
import * as indexManager from '../commons/indexManager.js';
import * as clientManager from '../commons/clientManager.js';
import * as storageManager from './storageManager.js';
import * as middlewareCompilerManager from './middlewareCompilerManager.js';

let serverRef = undefined;
let isMiddlewareInitialized = false;

export function loopback(options){
    return Promise.resolve('Response: ' + options.message);
}

export function error(options){
    return Promise.reject('Response: ' + options.message);
}

export function setServer(server){
    serverRef = server;
}

export function getModel(){
    return storageManager.readProjectJsonModel();
}

export function getConfig(){
    return Promise.resolve(config.asObject());
}

export function initMiddleware(){
    return new Promise((resolve, reject) => {
        if(serverRef && !isMiddlewareInitialized){
            const {app, ioSocketClient} = serverRef;
            app.use(middlewareCompilerManager.getDevMiddleware());
            app.use(middlewareCompilerManager.getHotMiddleware());
            app.use(middlewareCompilerManager.getBuilderMiddleware({
                callback: stats => {
                    ioSocketClient.emit('compiler.message', stats);
                }
            }));
            app.use(rewrite('/deskpage/*', '/desk/index.html'));
            app.use('/desk', express.static(config.deskDirPath()));
            isMiddlewareInitialized = true;
        }
        resolve();
    });
}

export function getComponentsTree(){
    return indexManager.getComponentsTree();
}

export function getComponentDefaults(options){
    return storageManager.readDefaults(options.componentName);
}

export function getComponentNotes(options){
    return storageManager.readComponentDocument(options.componentName);
}

export function getComponentSourceCode(options){
    return storageManager.readComponentSourceCode(options.filePath);
}

export function writeComponentSourceCode(options){
    return storageManager.writeComponentSourceCode(options.filePath, options.sourceCode);
}

export function saveProjectModel(options){
    return storageManager.writeProjectJsonModel(options.model);
}

export function initUserCredentialsByToken(options){
    return clientManager.initUserCredentialsByToken(options.token);
}

export function getProjectsGallery(){
    return clientManager.getAllProjects();
}