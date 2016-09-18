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

import {forOwn, uniq} from 'lodash';
import path from 'path';
import * as fileManager from '../commons/fileManager.js';
import * as indexManager from '../commons/indexManager.js';
import * as clientManager from '../commons/clientManager.js';
import * as config from '../commons/configuration.js';
import * as fileParser from '../commons/fileParser.js';
import * as npmUtils from '../commons/npmUtils.js';

export function readComponentSources(componentName, model){
    return indexManager.initIndex()
        .then(indexObj => {
            let found = undefined;
            if (indexObj.groups) {
                forOwn(indexObj.groups, (value, prop) => {
                    if(!found){
                        const {components} = value;
                        if (components && components.length > 0) {
                            found = components.find(i => i.name === componentName);
                        }
                    }
                });
            }
            return found;
        })
        .then(component => {
            if(!component){
                throw Error(`There is not such a component: ${componentName}`);
            }
            if(!component.absoluteSource){
                throw Error(`The source code of ${componentName} component is not found`);
            }
            const componentDirPath = path.dirname(component.absoluteSource);
            let isContainer = false;
            return fileManager.readDirectoryFiles(componentDirPath)
                .then(found => {
                    if (!found.files || found.files.length <= 0) {
                        throw Error(`There are no files in ${componentDirPath}`);
                    }
                    return found.files.reduce(
                        (sequence, filePath) => {
                            return sequence.then(fileObjects => {
                                let _fileObjects = fileObjects || [];
                                return fileManager.readFile(filePath)
                                    .then(fileData => {
                                        let dirPath = path.dirname(filePath);
                                        let fileName = path.basename(filePath);
                                        let extName = path.extname(fileName);
                                        if(extName === '.js' || extName === '.css'){
                                            let nestedDir = undefined;
                                            if(dirPath !== componentDirPath){
                                                nestedDir = dirPath.replace(componentDirPath + '/', '');
                                            }
                                            _fileObjects.push({
                                                dirPath: dirPath,
                                                filePath: filePath,
                                                sourceCode: fileData,
                                                fileName: fileName,
                                                nestedDir: nestedDir,
                                                name: path.basename(filePath, extName),
                                                extName: extName
                                            });
                                            if(fileName === 'reducer.js'){
                                                isContainer = true;
                                            }
                                        }
                                        return _fileObjects;
                                    });
                            }).catch(err => {
                                throw Error(err.message + '. Broken file: ' + filePath);
                            });
                        },
                        Promise.resolve()
                    );
                })
                .then(fileObjects => {
                    let deps = [];
                    if(fileObjects && fileObjects.length > 0){
                        fileObjects.forEach(fileObject => {
                            if(fileObject.extName === '.js'){
                                let imports = findImports(fileObject.sourceCode, fileObject.filePath);
                                if(imports.invalidImports.length > 0){
                                    throw Error('Invalid imports \n' + JSON.stringify(imports.invalidImports, null, 4) + '\n in ' + fileObject.fileName +
                                        '. Published component has to import from own dir or installed npm modules.');
                                } else {
                                    deps = deps.concat(imports.deps);
                                }
                            }
                        });
                        deps = uniq(deps);
                    }
                    return checkDependencies(deps)
                        .then(validDeps => {
                            return {
                                fileObjects,
                                readme: 'Not implemented yet',
                                componentName: component.name,
                                componentGroup: component.group,
                                componentDirPath: componentDirPath,
                                model: model,
                                isContainer: isContainer,
                                dependencies: validDeps
                            };
                    });
                });
        });
}

export function publishGenerator(generatorKey, dataObject){
    const {globalImport} = dataObject;
    if(globalImport && globalImport.fileName){
        const globalImportFilePath = path.join(config.appAssetsDirPath(), globalImport.fileName);
        return fileManager.readFile(globalImportFilePath)
            .catch(e => {
                throw Error('Can not find and read file: ' + globalImport.fileName + ' in app/assets directory.');
            })
            .then(fileData => {
                dataObject.globalImport.sourceCode = fileData;
                if(path.extname(globalImportFilePath) === '.js'){
                    let imports = findImports(fileData, globalImportFilePath);
                    if(imports.invalidImports.length > 0 || imports.validImports.length > 0){
                        throw Error('Invalid imports \n' +
                            JSON.stringify(imports.invalidImports, null, 4) +
                            '\n' +
                            JSON.stringify(imports.invalidImports, null, 4) +
                            '\n in ' + globalImportFilePath);
                    } else {
                        let deps = uniq(imports.deps);
                        return checkDependencies(deps).then(validDeps => {
                            dataObject.dependencies = dataObject.dependencies || {};
                            dataObject.dependencies.packages = dataObject.dependencies.packages || [];
                            dataObject.dependencies.packages = dataObject.dependencies.packages.concat(validDeps.packages);
                            return clientManager.publishFiles(generatorKey, dataObject);
                        });
                    }
                } else {
                    return clientManager.publishFiles(generatorKey, dataObject);
                }
            });
    } else {
        return clientManager.publishFiles(generatorKey, dataObject);
    }
}

function findImports(fileData, filePath){
    let ast = fileParser.getFileAst(fileData, filePath);
    let imports = {
        validImports: [],
        invalidImports:[],
        deps: []
    };
    fileParser.traverse(ast, node => {
        if(node.type === 'ImportDeclaration'){
            const {source} = node;
            if(source && source.value && source.value.length > 0){
                let testSource = source.value.replace(/\\/g, '/');
                if(testSource.indexOf('..') === 0){
                    imports.invalidImports.push(testSource);
                } else if(testSource.indexOf('.') === 0){
                    imports.validImports.push(testSource);
                } else {
                    let sourceParts = testSource.split('/');
                    if(sourceParts && sourceParts.length > 0){
                        if(sourceParts[0] && sourceParts[0].length > 0){
                            imports.deps.push(sourceParts[0]);
                        }
                    }
                }
            }
        }
    });
    return imports;
}

function checkDependencies(deps){
    let validDeps = {packages:[]};
    let tasks = [];
    if(deps && deps.length > 0){
        deps.forEach(dep => {
            tasks.push(
                npmUtils.getPackageVersion(dep, config.projectDir())
                    .then(version => {
                        if(version){
                            validDeps.packages.push({
                                name: dep, version: version
                            });
                        } else {
                            throw Error('Can not find module ' + dep + ' in node_modules. Published component has to import from own dir or installed npm modules.');
                        }
                    })
            );
        });
    }
    return Promise.all(tasks).then(() => {
        return validDeps;
    });
}
