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
import {forOwn} from 'lodash';
import * as fileManager from './fileManager.js';
import * as fileParser from './fileParser.js';

export const SERVICE_DIR = '.structor';
export const READY = 'ready-to-go';
export const EMPTY = 'dir-is-empty';

export const SERVICE_URL = 'http://localhost';

let config = {
    status: undefined,
    project: {
        paths: {},
        conf: {}
    },
    server: {
        paths: {},
        packageConf: {}
    }
};

function setupProjectPaths(rootDirPath){
    const absRoot = path.join(rootDirPath, SERVICE_DIR);
    config.project.paths = {
        dir: rootDirPath,
        configFilePath: path.join(absRoot, 'config.js'),
        webpackConfigFilePath: path.join(absRoot, 'webpack.config.js'),
        templatesDirPath: path.join(absRoot, 'templates'),
        deskSourceDirPath: path.join(absRoot, 'src'),
        deskPageFilePath: path.join(absRoot, 'src', 'PageForDesk.js'),
        deskEntryPointFilePath: path.join(absRoot, 'src', 'default.js'),
        deskIndexFilePath: path.join(absRoot, 'src', 'index.js'),
        generatorsDirPath: path.join(absRoot, 'generators'),
        docsDirPath: path.join(absRoot, 'docs'),
        docsReadmeFilePath: path.join(absRoot, 'docs', 'Readme.md'),
        docsComponentsDirPath: path.join(absRoot, 'docs', 'components'),
        componentDefaultsDirPath: path.join(absRoot, 'defaults'),
        nodeModulesDirPath: path.join(rootDirPath, 'node_modules'),
        deskModelFilePath: path.join(absRoot, 'desk', 'model.json'),
        deskDirPath: path.join(absRoot, 'desk')
    };
}

function setupServerPaths(rootDirPath){
    config.server.paths = {
        dir: rootDirPath,
        packageFilePath: path.join(rootDirPath, 'package.json'),
        nodeModulesDirPath: path.join(rootDirPath, 'node_modules')
    };
}

function checkPaths(confObj){
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

function checkProjectDir(){
    return checkPaths(config.project.paths);
}

function rewriteProjectConfigOption(optionString){
    return fileManager.readFile(config.project.paths.configFilePath)
        .then( data => {
            if(!data){
                throw Error('Project config file is empty.');
            }
            try{
                return fileParser.getFileAst(data);
            } catch(e){
                throw Error(e.message + '. File path: ' + config.project.paths.configFilePath);
            }
        })
        .then(ast => {
            var newAst = fileParser.getFileAst('var c = {' + optionString + '}');
            var newPart = null;
            fileParser.traverse(newAst, node => {
                if(node.type === 'VariableDeclarator' && node.id.name === 'c'){
                    newPart = node.init.properties[0];
                }
            });

            if (ast.body[0].declaration && ast.body[0].declaration.properties) {
                let properties = ast.body[0].declaration.properties;
                let index = -1;
                if (properties.length > 0) {
                    index = _.findIndex(properties, (o) => {
                        return (o.key && o.key.type === 'Identifier' && o.key.name === newPart.key.name);
                    });
                }
                if (index >= 0) {
                    ast.body[0].declaration.properties[index] = newPart;
                } else {
                    ast.body[0].declaration.properties.push(
                        newPart
                    );
                }
            }
            return fileManager.writeFile(
                config.project.paths.configFilePath, this.fileGenerator.generateFileFromAst(ast), false);
        });
}

function loadProjectConfig(){
    return new Promise((resolve, reject) => {
        try{
            delete require.cache[config.project.paths.configFilePath];
            config.project.conf = require(config.project.paths.configFilePath);
            resolve();
        } catch(e){
            reject('Could not load project config file. Error: ' + (e.message ? e.message : e));
        }
    });
}

function loadServerConfig(){
    return fileManager.readJson(config.server.paths.packageFilePath)
        .then(jsonData => {
            try{
                config.server.packageConf = JSON.stringify(jsonData);
            } catch(e){
                throw Error('Could not parse JSON file: ' + config.server.paths.packageFilePath);
            }
        });
}

export function serverDir(value){
    if(arguments.length > 0){
        setupServerPaths(value);
    } else {
        return config.server.paths.dir;
    }
}

export function projectDir(value){
    if(arguments.length > 0){
        setupProjectPaths(value);
    } else {
        return config.project.paths.dir;
    }
}

export function reinit(){
    const serverDirPath = serverDir();
    const projectDirPath = projectDir();
    return init(serverDirPath, projectDirPath);
}

export function init(serverDirPath, projectDirPath){
    config.status = undefined;
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
                            if(errors.length > 0){
                                let  messages = '';
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

export function status(){
    return config.status;
}

export function asObject(){
    return Object.assign({}, config);
}

export function serverNodeModulesDirPath(){
    return config.server.paths.nodeModulesDirPath;
}

export function webpackConfigFilePath(){
    return config.project.paths.webpackConfigFilePath;
}

export function deskEntryPointFilePath(){
    return config.project.paths.deskEntryPointFilePath;
}

export function deskDirPath(){
    return config.project.paths.deskDirPath;
}

export function deskModelFilePath(){
    return config.project.paths.deskModelFilePath;
}

export function deskIndexFilePath(){
    return config.project.paths.deskIndexFilePath;
}

export function nodeModulesDirPath(){
    return config.project.paths.nodeModulesDirPath;
}

export function componentDefaultsDirPath(){
    return config.project.paths.componentDefaultsDirPath;
}

export function docsComponentsDirPath(){
    return config.project.paths.docsComponentsDirPath;
}

export function projectName(){
    return config.project.conf.projectName;
}

export function projectId(){
    return config.project.conf.projectId;
}