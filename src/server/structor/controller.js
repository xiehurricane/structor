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
import httpProxy from 'http-proxy';
import * as config from '../commons/configuration.js';
import * as indexManager from '../commons/indexManager.js';
import * as clientManager from '../commons/clientManager.js';
import * as storageManager from './storageManager.js';
import * as middlewareCompilerManager from './middlewareCompilerManager.js';
import * as generatorManager from './generatorManager.js';
import * as exportManager from './exportManager.js';

let serverRef = undefined;
let proxy = undefined;

export function loopback(options){
    return Promise.resolve('Response: ' + options.message);
}

export function error(options){
    return Promise.reject('Response: ' + options.message);
}

export function setServer(server){
    serverRef = server;
    if(config.status() === config.READY){
        initServer();
        initProxyServer();
    }
}

function initServer(){
    if(serverRef){
        serverRef.app.use(middlewareCompilerManager.getDevMiddleware());
        serverRef.app.use(middlewareCompilerManager.getHotMiddleware());
        serverRef.app.use(middlewareCompilerManager.getBuilderMiddleware({
            callback: stats => {
                if(serverRef.ioSocketClient){
                    serverRef.ioSocketClient.emit('compiler.message', stats);
                }
            }
        }));
        serverRef.app.use(rewrite('/structor-deskpage/*', '/structor-desk/index.html'));
        serverRef.app.use('/structor-desk', express.static(config.deskDirPath()));
        
    }
}

function initProxyServer(){
    if(serverRef){
        if(!proxy && config.projectProxyURL()){
            proxy = httpProxy.createProxyServer({});
            proxy.on('error', (err, req, res) => {
                const statusText = 'Proxy server error connecting to ' + config.projectProxyURL() + req.url + " " + (err.message ? err.message : err);
                res.writeHead(500, statusText);
                res.end(statusText);
                console.error(statusText);
            });
            proxy.on('proxyReq', () => {
                const proxyURL = config.projectProxyURL().replace('http://', '');
                return (proxyReq, req, res, options) => {
                    proxyReq.setHeader('X-Forwarded-Host', proxyURL);
                }
            });
            //
            serverRef.app.all('/*', (req, res, next) => {
                let url = req.url;
                if (config.checkDeniedProxyURL(url)) {
                    next('route');
                } else {
                    let proxyURL = config.projectProxyURL();
                    if(proxyURL && proxyURL.length > 0){
                        proxy.web(req, res, { target: proxyURL });
                    } else {
                        next('route');
                    }
                }
            });
        }
    }
}

export function getModel(){
    return storageManager.readProjectJsonModel();
}

export function getConfig(){
    return Promise.resolve(config.asObject());
}

export function getProjectStatus(){
    return Promise.resolve(config.status());
}

export function setProxyURL(options){
    return config.rewriteProjectConfigOption('proxyURL', options.proxyURL)
        .then(() => {
            initProxyServer();
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

export function initUserCredentials(options){
    return clientManager.initUserCredentials(options.username, options.password);
}

export function removeUserCredentials(options){
    return clientManager.removeAuthToken();
}

export function getProjectsGallery(){
    return clientManager.getAllProjects();
}

export function getAvailableGeneratorsList(){
    return clientManager.getAvailableGeneratorsList();
}

export function getAvailableGeneratorGenerics(){
    return clientManager.getAvailableGeneratorGenerics();
}

export function pregenerate(options){
    const {generatorId, version, groupName, componentName, model} = options;
    return generatorManager.initGeneratorData(groupName, componentName, model)
        .then(generatorData => {
            return clientManager.invokePreGeneration(generatorId, version, generatorData);
        });
}

export function generate(options){
    const {generatorId, version, groupName, componentName, model, metadata} = options;
    return generatorManager.initGeneratorData(groupName, componentName, model, metadata)
        .then(generatorData => {
            // console.log('Generator data: ', JSON.stringify(generatorData));
            return clientManager.invokeGeneration(generatorId, version, generatorData).then(result => {
                // console.log('Resulting  data: ', JSON.stringify(result));
                return result;
            });
        });
}

export function saveGenerated(options){
    const {groupName, componentName, files, dependencies} = options;
    return generatorManager.installDependencies(dependencies).then(() => {
        return generatorManager.saveGenerated(groupName, componentName, files);
    });
}

// export function exportPages(options){
//     const {model} = options;
//     return exportManager.doGeneration(model).then(generatedObject => {
//         return exportManager.commitGeneration(generatedObject);
//     });
// }

export function getGeneratorReadme(options){
    const {userId, generatorId} = options;
    return clientManager.getGeneratorReadmeText(userId, generatorId);
}
