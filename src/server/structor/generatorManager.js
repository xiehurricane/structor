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

import { forOwn, has } from 'lodash';
import path from 'path';
import * as fileManager from '../commons/fileManager.js';
import * as config from '../commons/configuration.js';
import * as indexManager from '../commons/indexManager.js';
import * as npmUtils from '../commons/npmUtils.js';

function repairPath(path){
    if(path.substr(0, 1) !== '.'){
        path = './' + path;
    }
    return path;
}

export function initGeneratorData(groupName, componentName, model, metadata) {
    return indexManager.initIndex()
        .then(index => {
            let fileReaders = [];
            let project = config.getProjectConfig();
            let fileSources = {};
            fileReaders.push(
                fileManager.readFile(config.deskIndexFilePath())
                    .then(fileData => {
                        fileSources.deskIndexFile = fileData;
                    })
            );
            fileReaders.push(
                fileManager.readFile(config.deskReducersFilePath())
                    .then(fileData => {
                        fileSources.deskReducersFile = fileData;
                    })
            );
            fileReaders.push(
                fileManager.readFile(config.deskSagasFilePath())
                    .then(fileData => {
                        fileSources.deskSagasFile = fileData;
                    })
            );
            // forOwn(project.conf.files, (value, prop) => {
            //     fileReaders.push(
            //         fileManager.readFile(value)
            //             .then(fileData => {
            //                 fileSources[prop] = fileData;
            //             })
            //     );
            // });
            return Promise.all(fileReaders)
                .then(() => {
                    project.sources = fileSources;
                    return {groupName, componentName, model, metadata, project, index};
                });
        });
}

export function installDependencies(dependencies) {
    if (dependencies) {
        // const projectConfig = config.getProjectConfig();
        // if (!has(projectConfig, 'conf.paths.assetsDirPath')) {
        //     return Promise.reject('Wrong project configuration. \'assetsDirPath\' field is missing.');
        // }
        // if (!has(projectConfig, 'conf.files.assetsIndexFilePath')) {
        //     return Promise.reject('Wrong project configuration. \'assetsIndexFilePath\' field is missing.');
        // }
        const { packages } = dependencies;
        if (packages && packages.length > 0) {
            let installTask = Promise.resolve();
            let packageNames = '';
            packages.forEach(pkg => {
                installTask = installTask.then(() => {
                    return npmUtils.getPackageAbsolutePath(pkg.name, config.projectDir())
                        .then(packagePath => {
                            if (!packagePath) {
                                const version = pkg.version && pkg.version.trim().length > 0 ? '@' + pkg.version.trim() : '';
                                packageNames += pkg.name + version + ' ';
                            }
                        });
                })
            });
            installTask = installTask.then(() => {
                packageNames = packageNames.substr(0, packageNames.length - 1);
                if (packageNames && packageNames.length > 0) {
                    return npmUtils.installPackages(packageNames, config.projectDir());
                }
            });
            // packages.forEach(pkg => {
            //     const { copy } = pkg;
            //     if (copy && copy.length > 0) {
            //         let absDirPath;
            //         installTask = installTask.then(() => {
            //             return npmUtils.getPackageAbsolutePath(pkg.name, config.projectDir())
            //                 .then(packagePath => {
            //                     if(!packagePath){
            //                         throw Error('Package ' + pkg.name + ' was not installed properly.');
            //                     }
            //                     absDirPath = packagePath;
            //                 });
            //         });
            //         copy.forEach(copyItem => {
            //             installTask = installTask.then(() => {
            //                 const absSrcPath = path.join(absDirPath, copyItem.from).replace(/\\/g, '/');
            //                 const absDestPath = path.join(projectConfig.conf.paths.assetsDirPath, copyItem.to).replace(/\\/g, '/');
            //                 return fileManager.copyFile(absSrcPath, absDestPath);
            //             });
            //         });
            //     }
            // });

            return installTask;
        }
    }
    return Promise.resolve();
}

export function saveGenerated(groupName, componentName, files) {
    let fileSavers = [];
    let componentFilePath;
    files.forEach(fileObject => {
        if (fileObject.isComponent) {
            componentFilePath = fileObject.outputFilePath;
        }
        fileSavers.push(
            fileManager.ensureFilePath(fileObject.outputFilePath).then(() => {
                return fileManager.writeFile(fileObject.outputFilePath, fileObject.sourceCode, false);
            })
        );
    });
    return Promise.all(fileSavers).then(() => {
        return indexManager.initIndex();
        // if (componentFilePath) {
        //     const indexFileDirPath = config.deskSourceDirPath();
        //     const relativeFilePathInIndex = path.relative(indexFileDirPath, componentFilePath).replace(/\\/g, '/');
        //     return indexManager.addComponent(groupName, componentName, relativeFilePathInIndex);
        // } else {
        //     return indexManager.initIndex();
        // }
    });
}
