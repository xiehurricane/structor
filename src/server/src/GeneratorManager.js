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

import _ from 'lodash';
import path from 'path';
import FileManager from './FileManager.js';
import * as modelParser from './ModelParser.js';
import * as pathResolver from './PathResolver.js';
import * as formatter from './FileFormatter.js';

class GeneratorManager {

    constructor(sm, im, cm){

        this.sm = sm;
        this.clientManager = cm;
        this.fileManager = new FileManager();
        this.indexManager = im;
    }

    initGenerator(name){
        return this.fileManager.readDirectoryFiles(this.sm.getProject('generators.dirPath'), ['generator.json'])
            .then( found => {
                if(!found.files || found.files.length <= 0){
                    throw Error('Current project does not have generators.');
                }
                return found.files.reduce(
                    (sequence, filePath) => {
                        return sequence.then((jsonObject) => {
                            if(jsonObject){
                                return jsonObject;
                            } else {
                                return this.fileManager.readJson(filePath)
                                    .then( jsonObj => {
                                        if(jsonObj.name === name){
                                            return {
                                                dirPath: path.dirname(filePath),
                                                filePath: filePath,
                                                config: jsonObj
                                            }
                                        } else {
                                            return null;
                                        }
                                    });
                            }
                        }).catch( err => {
                            throw Error(err.message + '. Generator file path: ' + filePath);
                        });
                    },
                    Promise.resolve()
                );
            });
    }

    initGeneratorByFile(filePath){
        return this.fileManager.readJson(filePath)
            .then( jsonObj => {
                return {
                    dirPath: path.dirname(filePath),
                    filePath: filePath,
                    config: jsonObj
                }
            });
    }

    getGeneratorList(){
        return this.fileManager.readDirectory(this.sm.getProject('generators.dirPath'), ['generator.json'])
            .then( dirTree => {
                this.fileManager.traverseDirTree(dirTree, (type, obj) => {
                    if(obj.files && obj.files.length > 0){
                        obj.dirs = [];
                    }
                });
                let sequence = this.fileManager.readJson(this.sm.getProject('config.filePath'));
                this.fileManager.traverseDirTree(dirTree, (type, obj) => {
                    if(type === 'file'){
                        sequence = sequence.then(projectConfig => {
                            return this.fileManager.readJson(obj.filePath)
                                .then( jsonObj => {
                                    obj.config = jsonObj;
                                    obj.projectConfig = projectConfig;
                                    return projectConfig;
                                });
                        });
                    }
                });
                return sequence.then(() => { return dirTree; });
            })
            .then( dirTree => {
                let catalogs = {};
                let allFiles = [];
                let allCatalogs = [];
                if(dirTree.dirs && dirTree.dirs.length > 0){
                    dirTree.dirs.forEach(dir => {
                        if(dir.dirs && dir.dirs.length > 0){
                            allCatalogs.push({dirNamePath: dir.dirNamePath, dirName: dir.dirName});
                        }
                    });
                }
                this.fileManager.traverseDirTree(dirTree, (type, obj) => {
                    if(type === 'dir'){
                        if(obj.files && obj.files.length > 0){
                            allFiles = allFiles.concat(obj.files);
                        }
                        let files = [];
                        this.fileManager.traverseDirTree(obj, (_type, innerObj) => {
                            if(_type === 'file'){
                                files.push(innerObj);
                            }
                        });
                        if(files.length > 0){
                            let innerCatalogs = [];
                            if(obj.dirs && obj.dirs.length > 0){
                                obj.dirs.forEach(dir => {
                                    if(dir.dirs && dir.dirs.length > 0){
                                        innerCatalogs.push({dirNamePath: dir.dirNamePath, dirName: dir.dirName});
                                    }
                                });
                                catalogs[obj.dirNamePath] = {
                                    dirName: obj.dirName,
                                    catalogs: innerCatalogs,
                                    files: files
                                };
                            }
                        }
                    }
                });
                catalogs.All = {
                    catalogs: allCatalogs,
                    files: allFiles
                };
                _.forOwn(catalogs, (value, prop) => {
                    if(value.files && value.files.length > 0){
                        value.files.sort((a, b) => {
                            if (a.filePath > b.filePath) {
                                return 1;
                            }
                            if (a.filePath < b.filePath) {
                                return -1;
                            }
                            return 0;
                        });
                    }
                });
                return catalogs;
            });
    }

    createDataObject(componentModel, generatorObj, userInputObj){

        let dataObj = {
            component: {
                model: componentModel,
                componentName: userInputObj.componentName,
                groupName: userInputObj.groupName,
                indexFilePath: this.sm.getProject('index.filePath')
            },
            generator: {
                name: generatorObj.config.name,
                version: generatorObj.config.version,
                filePath: generatorObj.filePath,
                dirPath: generatorObj.dirPath
            },
            project: {
                dirPath: this.sm.getProject('dirPath')
            }
        };

        return this.fileManager.readJson(this.sm.getProject('config.filePath')).then(jsonData => {

            dataObj.project.config = jsonData;

            if(!generatorObj.config.component){
                throw Error('Generator ' + generatorObj.filePath + ' configuration does not have component section.');
            }

            dataObj.component.outputFilePath =
                path.join(
                    this.sm.getProject('dirPath'),
                    pathResolver.replaceInPath(
                        generatorObj.config.component.destDirPath,
                        _.pick(dataObj.component, ['componentName', 'groupName'])

                    ),
                    dataObj.component.componentName + '.' + generatorObj.config.component.fileExtension
                );
            if(generatorObj.config.component.script){
                dataObj.component.generatorScriptPath =
                    path.join(generatorObj.dirPath, this.sm.getProject('scripts.dirName'), generatorObj.config.component.script);
            }

            dataObj.modules = {};
            if(generatorObj.config.modules && generatorObj.config.modules.length > 0){
                generatorObj.config.modules.forEach((module, index) => {

                    let replaceInfoObj = _.pick(dataObj.component, ['componentName', 'groupName']);

                    dataObj.modules[module.id] = {
                        outputFilePath: path.join(
                            this.sm.getProject('dirPath'),
                            pathResolver.replaceInPath( module.destDirPath, replaceInfoObj ),
                            pathResolver.replaceInPath( module.name, replaceInfoObj )
                        ),
                        name: pathResolver.replaceInPath( module.name, replaceInfoObj ),
                        validateJS: module.validateJS
                    };
                    if(module.script){
                        dataObj.modules[module.id].generatorScriptPath =
                            path.join(generatorObj.dirPath, this.sm.getProject('scripts.dirName'), module.script);
                    }

                });
            }

        }).then(() => {
            return this.indexManager.initIndex()
                .then( indexObj => {

                    dataObj.component.imports = [];
                    dataObj.componentIndex = [];

                    let modelComponentMap = modelParser.getModelComponentMap(componentModel);
                    if(indexObj.groups){

                        _.forOwn(indexObj.groups, (value, prop) => {
                            if(value.components && value.components.length > 0){
                                value.components.forEach((componentInIndex) => {
                                    if(modelComponentMap[componentInIndex.name]){
                                        dataObj.component.imports.push({
                                            name: componentInIndex.name,
                                            source: componentInIndex.source,
                                            member: componentInIndex.member
                                        });
                                    }
                                    dataObj.componentIndex.push({
                                        name: componentInIndex.name,
                                        source: componentInIndex.source,
                                        member: componentInIndex.member
                                    });
                                });
                            }
                        });
                    }
                    //dataObj.generator = generatorObj;
                    return dataObj;
                });
        });

    }

    doPreGeneration(componentModel, generatorObj, userInputObj){
        return this.createDataObject(componentModel, generatorObj, userInputObj)
            .then( dataObj => {
                let module = require(dataObj.component.generatorScriptPath);
                return module.preProcess(dataObj)
                    .catch(err => {
                        throw Error('Generator script failed. ' + err + '. File path: ' + dataObj.component.generatorScriptPath);
                    });
            });
    }

    doPreGenerationOnline(componentModel, generatorObj, userInputObj){
        return this.createDataObject(componentModel, generatorObj, userInputObj)
            .then( dataObj => {
                let dataOnline = {
                    generator: dataObj.generator,
                    project: dataObj.project
                };
                dataOnline.componentPerspective = pathResolver.resolveFromComponentPerspective({
                    component: dataObj.component,
                    componentIndex: dataObj.componentIndex,
                    modules: dataObj.modules
                });
                const { generatorScriptPath } = dataObj.component;
                if(generatorScriptPath){
                    let module = require(generatorScriptPath);
                    return module.preProcess(dataOnline)
                        .catch(err => {
                            throw Error('Generator script failed. ' + err + '. File path: ' + generatorScriptPath);
                        });
                }
                return dataOnline;
            }).then( dataOnline => {
                return this.clientManager.invokePreGenerationOnline({ data: dataOnline } );
            });
    }

    doGeneration(componentModel, generatorObj, userInputObj, meta){
        return this.createDataObject(componentModel, generatorObj, userInputObj)
            .then( dataObj => {

                let generatedObj = {
                    component: {},
                    modules: {}
                };
                let sequence = Promise.resolve();

                sequence = sequence.then( () => {
                    let componentData = pathResolver.resolveFromComponentPerspective(dataObj);
                    componentData.meta = meta;
                    let module = require(componentData.component.generatorScriptPath);
                    return module.process(componentData)
                        .then( sourceCode => {
                            generatedObj.component.sourceCode = sourceCode;
                            generatedObj.component.outputFilePath = componentData.component.outputFilePath;
                            generatedObj.component.relativeFilePathInIndex = componentData.component.relativeFilePathInIndex;
                            generatedObj.component.componentName = componentData.component.componentName;
                            generatedObj.component.groupName = componentData.component.groupName;
                        })
                        .catch( err => {
                            throw Error('Generator script failed. ' + err + '. File path: ' + componentData.component.generatorScriptPath);
                        });
                });

                _.forOwn(dataObj.modules, (value, prop) => {
                    sequence = sequence.then( () => {
                        let moduleData = pathResolver.resolveFromModulePerspective(dataObj, prop);
                        moduleData.meta = meta;
                        let module = require(value.generatorScriptPath);
                        return module.process(moduleData)
                            .then(sourceCode => {
                                generatedObj.modules[prop] = {
                                    sourceCode: sourceCode,
                                    outputFilePath: moduleData.modules[prop].outputFilePath,
                                    name: moduleData.modules[prop].name,
                                    id: prop
                                };
                            })
                            .catch( err => {
                                throw Error('Generator script failed. ' + err + '. File path: ' + value.generatorScriptPath);
                            });
                    });
                });

                sequence = sequence.then(() => {
                    return generatedObj;
                });

                return sequence;
            });
    }

    doGenerationOnline(componentModel, generatorObj, userInputObj, meta){
        return this.createDataObject(componentModel, generatorObj, userInputObj)
            .then(dataObj => {

                let dataOnline = {
                    metadata: meta,
                    generator: dataObj.generator,
                    project: dataObj.project,
                    modulesPerspective: {}
                };

                dataOnline.componentPerspective = pathResolver.resolveFromComponentPerspective({
                    component: dataObj.component,
                    componentIndex: dataObj.componentIndex,
                    modules: dataObj.modules
                });

                _.forOwn(dataObj.modules, (value, prop) => {
                    dataOnline.modulesPerspective[prop] = pathResolver.resolveFromModulePerspective({
                        component: dataObj.component,
                        componentIndex: dataObj.componentIndex,
                        modules: dataObj.modules
                    }, prop);
                });

                let sequence = Promise.resolve();
                sequence = sequence.then( () => {
                    const { generatorScriptPath } = dataObj.component;
                    if (generatorScriptPath) {
                        let module = require(generatorScriptPath);
                        return module.process(dataOnline)
                            .then( data => {
                                dataOnline = data;
                            })
                            .catch(err => {
                                throw Error('Generator script failed. ' + err + '. File path: ' + generatorScriptPath);
                            });
                    }
                });
                _.forOwn(dataObj.modules, (value, prop) => {
                    sequence = sequence.then( () => {
                        if (value.generatorScriptPath) {
                            let module = require(value.generatorScriptPath);
                            return module.process(dataOnline)
                                .then( data => {
                                    dataOnline = data;
                                })
                                .catch(err => {
                                    throw Error('Generator script failed. ' + err + '. File path: ' + value.generatorScriptPath);
                                });
                        }
                    });
                });
                return sequence.then( () => {
                    return this.clientManager.invokeGenerationOnline({data: dataOnline});
                });
            });
    }

    commitGeneration(generatedObj){
        let sequence = Promise.resolve();

        _.forOwn(generatedObj.modules, (value, prop) => {
            if(value.sourceCode && value.sourceCode.length > 0){
                sequence = sequence.then(() => {
                    return this.fileManager.ensureFilePath(value.outputFilePath)
                        .then(() => {
                            return this.fileManager.writeFile(
                                value.outputFilePath,
                                value.sourceCode,
                                false
                            )
                        });
                });
            }
        });

        sequence = sequence.then( () => {
            return this.fileManager.ensureFilePath(generatedObj.component.outputFilePath)
                .then(() => {
                    return this.fileManager.writeFile(
                        generatedObj.component.outputFilePath,
                        generatedObj.component.sourceCode,
                        false
                    )
                        .then(() => {
                            return this.indexManager.addComponent(
                                generatedObj.component.groupName,
                                generatedObj.component.componentName,
                                generatedObj.component.relativeFilePathInIndex
                            )
                        });
                })
        });
        return sequence;
    }

    //preGenerateText(scriptFilePath, dataObj){
    //
    //    let module = require(scriptFilePath);
    //    return module.preProcess(dataObj).catch( err => {
    //        throw Error('Generator script failed. ' + err + '. File path: ' + scriptFilePath);
    //    });
    //
    //}
    //
    //generateText(scriptFilePath, dataObj, formatJS = true){
    //
    //    let module = require(scriptFilePath);
    //    return module.process(dataObj).then( sourceCode => {
    //        if (formatJS) {
    //            let prevSourceCode = sourceCode;
    //            try {
    //                return formatter.formatJsFile(sourceCode);
    //            } catch (e) {
    //                let errorFilePath = path.join(this.sm.getProject('dirPath'), '.errors', 'generators', path.basename(scriptFilePath));
    //                this.fileManager.ensureFilePath(errorFilePath)
    //                    .then(() => {
    //                        this.fileManager.writeFile(errorFilePath, prevSourceCode);
    //                    })
    //                    .catch(err => {
    //                        console.error('Writing bad file. ' + err);
    //                    });
    //                throw e;
    //            }
    //        } else {
    //            return sourceCode;
    //        }
    //    })
    //    .catch( err => {
    //        throw Error('Generator script failed. ' + err + '. File path: ' + scriptFilePath);
    //    });
    //
    //}

}

export default GeneratorManager;
