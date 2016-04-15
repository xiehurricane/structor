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

import path from 'path';
import express from 'express';
import * as clientManager from '../commons/clientManager.js';
import * as storageManager from './storageManager.js';
import * as projectCompiler from './projectCompiler.js';
import * as generatorManager from './generatorManager.js';
import * as config from '../commons/configuration.js';

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
        serverRef.app.use('/sandbox-preview', express.static(path.join(config.sandboxDirPath(), 'work', '.structor', 'desk')));
    }
}

export function makeWorkingDirectory(options){
    return storageManager.makeWorkingCopy();
}

export function removeWorkingDirectory(options){
    return storageManager.deleteWorkingCopy();
}

export function compileWorkingDesk(options){
    return projectCompiler.compileWorkingCopy();
}

export function getGeneratorSamples(options){
    return clientManager.getGeneratorSamples();
}

export function sandboxPrepare(options){
    return clientManager.sandboxPrepare(options.generatorId, options.version);
}

export function sandboxReadFiles(options){
    return clientManager.sandboxReadFiles(options.sampleId);
}

export function sandboxWriteFiles(options){
    return clientManager.sandboxWriteFiles(options.sampleId, options.filesObject);
}

export function sandboxGenerate(options){
    const {sampleId, metadata, model} = options;
    return generatorManager.initGeneratorData('TestGroup', 'TestComponent', model, metadata)
        .then(generatorData => {
            return clientManager.sandboxProcess(sampleId, generatorData);
        });
}

export function saveSandboxGenerated(options){
    const {files, dependencies} = options;
    return generatorManager.installDependencies(dependencies).then(() => {
        return generatorManager.saveGenerated(files);
    });
}
