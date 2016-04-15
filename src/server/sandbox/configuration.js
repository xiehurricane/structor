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
import * as fileManager from '../commons/fileManager.js';

export const SERVICE_DIR = '.structor';

let config = {
    project: {
        paths: {},
        conf: {}
    }
};

function setupProjectPaths(rootDirPath) {
    const absRoot = path.join(rootDirPath, SERVICE_DIR);
    config.project.paths = {
        dir: rootDirPath,
        configFilePath: path.join(absRoot, 'config.json'),
        deskSourceDirPath: path.join(absRoot, 'src'),
        //deskPageFilePath: path.join(absRoot, 'src', 'PageForDesk.js'),
        deskPageTemplatePath: path.join(absRoot, 'src', 'PageForDesk.tpl'),
        deskEntryPointFilePath: path.join(absRoot, 'src', 'default.js'),
        deskDirPath: path.join(absRoot, 'desk'),
        docsDirPath: path.join(absRoot, 'docs'),
        docsComponentsDirPath: path.join(absRoot, 'docs', 'components')
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
                    newPaths[prop] = path.join(config.project.paths.dir, value);
                });
            } else {
                throw Error('The paths section is missing in the current project configuration.');
            }
            let newFiles = {};
            if (jsonData.files) {
                forOwn(jsonData.files, (value, prop) => {
                    newFiles[prop] = path.join(config.project.paths.dir, value);
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

export function projectDir(value) {
    if (arguments.length > 0) {
        setupProjectPaths(value);
    } else {
        return config.project.paths.dir;
    }
}

export function init(projectDirPath) {
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
        });
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

//export function deskPageFilePath(){
//    return config.project.paths.deskPageFilePath;
//}

export function deskPageTemplatePath(){
    return config.project.paths.deskPageTemplatePath;
}

export function getProjectConfig() {
    return config.project;
}
