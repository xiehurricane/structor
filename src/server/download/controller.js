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
import * as npmUtils from '../commons/npmUtils.js';
import * as config from '../commons/configuration.js';

let postInstallationCallback = undefined;
let currentProjectDirPath = undefined;

export function getProjectStatus(){
    return Promise.resolve(config.status());
}

export function setPostInstallationCallback(func){
    postInstallationCallback = func;
}

export function setProjectDirPath(projectDirPath){
    currentProjectDirPath = projectDirPath;
}

export function prepareProject(options){
    return clientManager.downloadGalleryFile(options.downloadUrl)
        .then(file => {
            return storageManager.writeProject(currentProjectDirPath, file);
        })
        .then(() => {
            return npmUtils.installDefault(currentProjectDirPath);
        })
        .then(() => {
            if(postInstallationCallback){
                return postInstallationCallback();
            }
        });
}

export function getProjectList(){
    return clientManager.getAllProjects();
}