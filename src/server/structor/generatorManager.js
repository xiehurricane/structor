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

import { forOwn } from 'lodash';
import path from 'path';
import * as fileManager from '../commons/fileManager.js';
import * as config from '../commons/configuration.js';
import * as indexManager from '../commons/indexManager.js';

export function initGeneratorData(groupName, componentName, model, metadata){
    return indexManager.initIndex()
        .then(index => {
            let fileReaders = [];
            let project = config.getProjectConfig();
            let fileSources = {};
            forOwn(project.files, (value, prop) => {
                fileReaders.push(
                    fileManager.readFile(value)
                        .then(fileData => {
                            fileSources[prop] = fileData;
                        })
                );
            });
            return Promise.all(fileReaders)
                .then(() => {
                    project.sources = fileSources;
                    return { groupName, componentName, model, metadata, project, index };
                });
        });
}

export function saveGenerated(groupName, componentName, files){
    let fileSavers = [];
    let componentFilePath;
    files.forEach(fileObject => {
        if(fileObject.isComponent){
            componentFilePath = fileObject.outputFilePath;
        }
        fileSavers.push(
            fileManager.ensureFilePath(fileObject.outputFilePath).then(() => {
                return fileManager.writeFile(fileObject.outputFilePath, fileObject.sourceCode, false);
            })
        );
    });
    return Promise.all(fileSavers).then(() => {
        if(componentFilePath){
            const indexFileDirPath = config.deskSourceDirPath();
            const relativeFilePathInIndex = path.relative(indexFileDirPath, componentFilePath).replace(/\\/g, '/');
            return indexManager.addComponent(groupName, componentName, relativeFilePathInIndex);
        } else {
            return indexManager.initIndex();
        }
    });
}
