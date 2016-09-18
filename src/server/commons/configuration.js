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
import {forOwn, get, set} from 'lodash';
import * as fileManager from './fileManager.js';
import * as fileParser from './fileParser.js';

export const SERVICE_DIR = '.structor';
export const READY = 'ready-to-go';
export const EMPTY = 'dir-is-empty';

// export const SERVICE_URL = 'https://helmetrex.com';
export const SERVICE_URL = 'http://localhost';

export const STRUCTOR_URLS = [
    '/structor',
    '/structor-invoke',
    '/structor-sandbox',
    '/structor-deskpage',
    '/structor-dev',
    '/structor-desk',
    '/structor-sandbox-preview',
    '/structor-sandbox-screenshot'
];

let config = {
    status: undefined,
    debugMode: false,
    project: {
        paths: {},
        conf: {}
    },
    server: {
        paths: {},
        packageConf: {}
    }
};

function setupProjectPaths(rootDirPath) {
    const absRoot = path.join(rootDirPath, SERVICE_DIR).replace(/\\/g, '/');
    config.project.paths = {
        dir: rootDirPath,
        configFilePath: path.join(absRoot, 'config.json').replace(/\\/g, '/'),
        webpackConfigFilePath: path.join(absRoot, 'webpack.config.js').replace(/\\/g, '/'),
        deskIndexFilePath: path.join(absRoot, 'app', 'components.js').replace(/\\/g, '/'),
        deskReducersFilePath: path.join(absRoot, 'app', 'reducers.js').replace(/\\/g, '/'),
        deskSagasFilePath: path.join(absRoot, 'app', 'sagas.js').replace(/\\/g, '/'),
        componentDefaultsDirPath: path.join(absRoot, 'defaults').replace(/\\/g, '/'),
        docsComponentsDirPath: path.join(absRoot, 'docs', 'components').replace(/\\/g, '/'),

        appDirPath: path.join(rootDirPath, 'app').replace(/\\/g, '/'),
        appAssetsDirPath: path.join(rootDirPath, 'app', 'assets').replace(/\\/g, '/'),

        sandboxDirPath: path.join(absRoot, 'sandbox').replace(/\\/g, '/'),

        // templatesDirPath: path.join(absRoot, 'templates').replace(/\\/g, '/'),
        deskSourceDirPath: path.join(absRoot, 'src').replace(/\\/g, '/'),
        deskPageFilePath: path.join(absRoot, 'src', 'PageForDesk.js').replace(/\\/g, '/'),
        deskEntryPointFilePath: path.join(absRoot, 'src', 'default.js').replace(/\\/g, '/'),
        docsDirPath: path.join(absRoot, 'docs').replace(/\\/g, '/'),
        docsReadmeFilePath: path.join(absRoot, 'docs', 'Readme.md').replace(/\\/g, '/'),
        nodeModulesDirPath: path.join(rootDirPath, 'node_modules').replace(/\\/g, '/'),
        deskModelFilePath: path.join(absRoot, 'desk', 'model.json').replace(/\\/g, '/'),
        deskDirPath: path.join(absRoot, 'desk').replace(/\\/g, '/')
    };
}

function setupServerPaths(rootDirPath) {
    config.server.paths = {
        dir: rootDirPath,
        packageFilePath: path.join(rootDirPath, 'package.json').replace(/\\/g, '/'),
        nodeModulesDirPath: path.join(rootDirPath, 'node_modules').replace(/\\/g, '/')
    };
}

function checkPaths(confObj) {
    let sequence = Promise.resolve([]);
    forOwn(confObj, (value, prop) => {
        sequence = sequence.then(errors => {
            return fileManager.isExisting(value)
                .then(() => {
                    return errors;
                })
                .catch(error => {
                    errors.push(error);
                    return errors;
                })
        });
    });
    return sequence;
}

function checkProjectDir() {
    return checkPaths(config.project.paths);
}

function loadProjectConfig() {
    return fileManager.readJson(config.project.paths.configFilePath)
        .then(jsonData => {
            let newPaths = {};
            if (jsonData.paths) {
                forOwn(jsonData.paths, (value, prop) => {
                    newPaths[prop] = path.join(config.project.paths.dir, value).replace(/\\/g, '/');
                });
            } else {
                throw Error('The paths section is missing in the current project configuration.');
            }
            let newFiles = {};
            if (jsonData.files) {
                forOwn(jsonData.files, (value, prop) => {
                    newFiles[prop] = path.join(config.project.paths.dir, value).replace(/\\/g, '/');
                });
            } else {
                throw Error('The files section is missing in the current project configuration.');
            }
            config.project.conf = Object.assign({}, jsonData, {
                paths: newPaths,
                files: newFiles
            });
        });
}

function loadServerConfig() {
    return fileManager.readJson(config.server.paths.packageFilePath)
        .then(jsonData => {
            try {
                config.server.packageConf = JSON.stringify(jsonData);
            } catch (e) {
                throw Error('Could not parse JSON file: ' + config.server.paths.packageFilePath);
            }
        });
}

export function serverDir(value) {
    if (arguments.length > 0) {
        setupServerPaths(value);
    } else {
        return config.server.paths.dir;
    }
}

export function projectDir(value) {
    if (arguments.length > 0) {
        setupProjectPaths(value);
    } else {
        return config.project.paths.dir;
    }
}

export function reinit() {
    const serverDirPath = serverDir();
    const projectDirPath = projectDir();
    return init(serverDirPath, projectDirPath);
}

export function init(serverDirPath, projectDirPath, debugMode) {
    config.status = undefined;
    config.debugMode = debugMode;
    serverDir(serverDirPath);
    return loadServerConfig()
        .then(() => {
            return fileManager.checkDirIsEmpty(projectDirPath)
                .then(() => {
                    config.status = EMPTY;
                    return EMPTY;
                })
                .catch(e => {
                    projectDir(projectDirPath);
                    return checkProjectDir()
                        .then(errors => {
                            if (errors.length > 0) {
                                let messages = '';
                                errors.forEach(error => {
                                    messages += error + '\n';
                                });
                                throw Error(messages);
                            }
                        })
                        .then(() => {
                            return loadProjectConfig();
                        })
                        .then(() => {
                            config.status = READY;
                            return READY;
                        })
                });
        });
}

export function rewriteProjectConfigOption(optionPath, optionValue){
    return fileManager.readJson(config.project.paths.configFilePath)
        .then(jsonData => {
            set(jsonData, optionPath, optionValue);
            return fileManager.writeJson(config.project.paths.configFilePath, jsonData);
        })
        .then(() => {
            return loadProjectConfig();
        })
}

export function checkDeniedProxyURL(textUrl){
    let isDenied = false;
    if(textUrl){
        for(let i = 0; i < STRUCTOR_URLS.length; i++){
            if(textUrl.indexOf(STRUCTOR_URLS[i]) === 0){
                isDenied = true;
                break;
            }
        }
    }
    return isDenied;
}

export function status() {
    return config.status;
}

export function getDebugMode(){
    return config.debugMode;
}

export function asObject() {
    return Object.assign({}, config);
}

export function serverNodeModulesDirPath() {
    return config.server.paths.nodeModulesDirPath;
}

export function appDirPath() {
    return config.project.paths.appDirPath;
}

export function webpackConfigFilePath() {
    return config.project.paths.webpackConfigFilePath;
}

export function deskEntryPointFilePath() {
    return config.project.paths.deskEntryPointFilePath;
}

export function deskDirPath() {
    return config.project.paths.deskDirPath;
}

export function deskModelFilePath() {
    return config.project.paths.deskModelFilePath;
}

export function deskSourceDirPath(){
    return config.project.paths.deskSourceDirPath;
}

export function deskIndexFilePath() {
    return config.project.paths.deskIndexFilePath;
}

export function deskReducersFilePath() {
    return config.project.paths.deskReducersFilePath;
}

export function deskSagasFilePath() {
    return config.project.paths.deskSagasFilePath;
}

export function nodeModulesDirPath() {
    return config.project.paths.nodeModulesDirPath;
}

export function componentDefaultsDirPath() {
    return config.project.paths.componentDefaultsDirPath;
}

export function docsComponentsDirPath() {
    return config.project.paths.docsComponentsDirPath;
}

export function templatesDirPath(){
    return config.project.paths.templatesDirPath;
}

export function projectName() {
    return config.project.conf.projectName;
}

export function projectId() {
    return config.project.conf.projectId;
}

export function getProjectConfig() {
    return config.project;
}

export function projectProxyURL(){
    return config.project.conf.proxyURL;
}

export function sandboxDirPath(){
    return config.project.paths.sandboxDirPath;
}

export function appAssetsDirPath(){
    return config.project.paths.appAssetsDirPath;
}
