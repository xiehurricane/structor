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
import * as generatorManager from './generatorManager.js';
import * as exportManager from './exportManager.js';

let serverRef = undefined;

export function loopback(options){
    return Promise.resolve('Response: ' + options.message);
}

export function error(options){
    return Promise.reject('Response: ' + options.message);
}

export function setServer(server){
    serverRef = server;
    serverRef.app.use(middlewareCompilerManager.getDevMiddleware());
    serverRef.app.use(middlewareCompilerManager.getHotMiddleware());
    serverRef.app.use(middlewareCompilerManager.getBuilderMiddleware({
        callback: stats => {
            if(serverRef.ioSocketClient){
                serverRef.ioSocketClient.emit('compiler.message', stats);
            }
        }
    }));
    serverRef.app.use(rewrite('/deskpage/*', '/desk/index.html'));
    serverRef.app.use('/desk', express.static(config.deskDirPath()));
}

export function getModel(){
    return storageManager.readProjectJsonModel();
}

export function getConfig(){
    return Promise.resolve(config.asObject());
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
            return clientManager.invokeGeneration(generatorId, version, generatorData);
        });
}

export function saveGenerated(options){
    const {groupName, componentName, files, dependencies} = options;
    return generatorManager.installDependencies(dependencies).then(() => {
        return generatorManager.saveGenerated(groupName, componentName, files);
    });
}

export function exportPages(options){
    const {model} = options;
    return exportManager.doGeneration(model).then(generatedObject => {
        return exportManager.commitGeneration(generatedObject);
    });
}

export function getGeneratorBrief(options){
    const {projectId, userId, generatorId} = options;
    return clientManager.getGeneratorBriefText(projectId, userId, generatorId);
}