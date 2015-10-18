
import _ from 'lodash';
import path from 'path';
import FileManager from './FileManager.js';
import * as modelParser from './ModelParser.js';
import * as pathResolver from './PathResolver.js';
import * as formatter from './FileFormatter.js';

class GeneratorManager {

    constructor(sm, im){

        this.sm = sm;

        //
        //this.projectDirPath = projectDirPath;
        //this.builderDirPath = path.join(projectDirPath, builderDirName);
        //this.generatorsDirPath = path.join(this.builderDirPath, generatorsDirName);
        //this.sourceDirPath = path.join(this.builderDirPath, sourceDirName);
        //this.indexFilePath = path.join(this.sourceDirPath, 'index.js');
        //this.scriptsDirName = scriptsDirName;

        this.fileManager = new FileManager();
        this.indexManager = im;
    }

    initGenerator(name){
        return this.fileManager.readDirectory(this.sm.getProject('generators.dirPath'), ['generator.json'])
            .then( found => {
                if(!found.files || found.files.length <= 0){
                    throw Error('Current project does not have a generator, please add a generator.');
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

    getGeneratorList(){
        return this.fileManager.readDirectory(this.sm.getProject('generators.dirPath'), ['generator.json'])
            .then( found => {
                if(!found.files || found.files.length <= 0){
                    throw Error('Current project does not have a generator, please add a generator.');
                }
                let generatorList = [];
                let chain = found.files.reduce(
                    (sequence, filePath) => {
                        return sequence.then((jsonObject) => {
                            if(jsonObject){
                                return jsonObject;
                            } else {
                                return this.fileManager.readJson(filePath)
                                    .then( jsonObj => {
                                        generatorList.push(
                                            {
                                                dirPath: path.dirname(filePath),
                                                filePath: filePath,
                                                config: jsonObj
                                            }
                                        );
                                    });
                            }
                        }).catch( err => {
                            throw Error(err.message + '. Generator file path: ' + filePath);
                        });
                    },
                    Promise.resolve()
                );
                return chain.then( () => {
                    generatorList.sort( (a, b) => {
                        if (a.config.name > b.config.name) {
                            return 1;
                        }
                        if (a.config.name < b.config.name) {
                            return -1;
                        }
                        return 0;
                    });
                    return generatorList;
                });
            });
    }

    createDataObject(componentModel, generatorName, userInputObj){
        let dataObj = {
            component: {
                model: componentModel,
                componentName: userInputObj.componentName,
                groupName: userInputObj.groupName,
                indexFilePath: this.sm.getProject('index.filePath')
            }
        };

        return this.indexManager.initIndex()
            .then( indexObj => {

                dataObj.component.imports = [];

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
                            });
                        }
                    });
                }
                return this.initGenerator(generatorName).then( generatorObj => {
                    if(!generatorObj.config){
                        throw Error('Generator ' + generatorObj.filePath + ' is not configured properly.');
                    }
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
                    dataObj.component.generatorScriptPath =
                        path.join(generatorObj.dirPath, this.sm.getProject('scripts.dirName'), generatorObj.config.component.script);

                    dataObj.modules = {};
                    if(generatorObj.config.modules && generatorObj.config.modules.length > 0){
                        generatorObj.config.modules.forEach((module, index) => {

                            let replaceInfoObj = _.pick(dataObj.component, ['componentName', 'groupName']);

                            dataObj.modules[module.id] = {
                                outputFilePath: path.join(
                                    this.sm.getProject('dirPath'),
                                    pathResolver.replaceInPath( module.destDirPath, replaceInfoObj ),
                                    pathResolver.replaceInPath( module.name, replaceInfoObj ) + '.js'
                                ),
                                name: pathResolver.replaceInPath( module.name, replaceInfoObj ),
                                generatorScriptPath: path.join(generatorObj.dirPath, this.sm.getProject('scripts.dirName'), module.script),
                                validateJS: module.validateJS
                            };

                        });
                    }
                    //dataObj.generator = generatorObj;
                    return dataObj;
                });
            });
    }

    doGeneration(componentModel, generatorName, userInputObj){
        return this.createDataObject(componentModel, generatorName, userInputObj)
            .then( dataObj => {

                let generatedObj = {
                    component: {},
                    modules: {}
                };
                let sequence = Promise.resolve();

                sequence = sequence.then( () => {
                    let componentData = pathResolver.resolveFromComponentPerspective(dataObj);
                    return this.generateText(componentData.component.generatorScriptPath, componentData)
                        .then( sourceCode => {

                            generatedObj.component.sourceCode = sourceCode;
                            generatedObj.component.outputFilePath = componentData.component.outputFilePath;
                            generatedObj.component.relativeFilePathInIndex = componentData.component.relativeFilePathInIndex;
                            generatedObj.component.componentName = componentData.component.componentName;
                            generatedObj.component.groupName = componentData.component.groupName;
                        });
                });


                _.forOwn(dataObj.modules, (value, prop) => {
                    sequence = sequence.then( () => {
                        try{
                            let moduleData = pathResolver.resolveFromModulePerspective(dataObj, prop);
                            return this.generateText(value.generatorScriptPath, moduleData)
                                .then(sourceCode => {
                                    generatedObj.modules[prop] = {
                                        sourceCode: sourceCode,
                                        outputFilePath: moduleData.modules[prop].outputFilePath,
                                        name: moduleData.modules[prop].name
                                    };
                                });
                        } catch (e){
                            throw Error(e);
                        }
                    });
                });

                sequence = sequence.then(() => {
                    return this.fileManager.removeFile(path.join(this.sm.getProject('dirPath'), '.errors'))
                        .then( () => {
                            return generatedObj;
                        });
                });

                return sequence;
            });
    }

    commitGeneration(generatedObj){
        let sequence = Promise.resolve();

        _.forOwn(generatedObj.modules, (value, prop) => {
            sequence = sequence.then(() => {
                return this.fileManager.ensureFilePath(value.outputFilePath)
                    .then(() => {
                        return this.fileManager.writeFile(
                            value.outputFilePath,
                            value.sourceCode,
                            true
                        )
                    });
            });
        });

        sequence = sequence.then( () => {
            return this.fileManager.ensureFilePath(generatedObj.component.outputFilePath)
                .then(() => {
                    return this.fileManager.writeFile(
                        generatedObj.component.outputFilePath,
                        generatedObj.component.sourceCode,
                        true
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

    generateText(scriptFilePath, dataObj, formatJS = true){
        return new Promise( (resolve, reject) => {
            try{
                let scriptRealPath = require.resolve(scriptFilePath);
                if(scriptRealPath && require.cache[scriptRealPath]){
                    delete require.cache[scriptRealPath];
                }
                let module = require(scriptFilePath);
                module(
                    dataObj,
                    sourceCode => {
                        if (formatJS) {
                            let prevResult = sourceCode;
                            try {
                                let result = formatter.formatJsFile(sourceCode);
                                resolve(result);
                            } catch (e) {
                                let errorFilePath = path.join(this.sm.getProject('dirPath'), '.errors', 'generators', path.basename(scriptFilePath));
                                this.fileManager.ensureFilePath(errorFilePath)
                                    .then(() => {
                                        this.fileManager.writeFile(errorFilePath, prevResult)
                                    })
                                    .catch(err => {
                                        console.error('Writing bad file. Error: ' + err);
                                    });
                                reject('Validation failed. ' + e + '. Generator script file path: ' + scriptFilePath);
                            }
                        } else {
                            resolve(sourceCode);
                        }
                    },
                    err => {
                        reject('Processing generator\'s method is failed. Error: ' + err + '. File path: ' + scriptFilePath);
                    }
                );
            } catch(e){
                reject('Loading generator\'s script is failed. Error: ' + e + '. File path: ' + scriptFilePath);
            }
        });

    }

}

export default GeneratorManager;
