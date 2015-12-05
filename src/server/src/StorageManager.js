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
import _ from 'lodash';
import child_process from 'child_process';
import FileManager from './FileManager.js';
import ProjectCompiler from './ProjectCompiler.js';

const exec = child_process.exec;

function isFirstCharacterInUpperCase(text){
    if (text && text.length > 0) {
        let firstChar = text.charAt(0);
        let firstCharUpperCase = firstChar.toUpperCase();
        return firstChar === firstCharUpperCase;
    }
    return false;
}

class StorageManager {

    constructor(sm){
        this.sm = sm;

        this.fileManager = new FileManager();
        this.compiler = new ProjectCompiler();

    }

    readServerConfig(){
        return this.fileManager.readJson(this.sm.getServer('config.filePath')).then( jsonObj => {
            return jsonObj;
        });
    }

    writeServerConfig(configObj){
        return this.fileManager.writeJson(this.sm.getServer('config.filePath'), configObj);
    }

    readPackageConfig(){
        return this.fileManager.readJson(this.sm.getServer('npmPackage.filePath'));
    }

    cleanServerStorage(){
        return this.fileManager.removeFile(this.sm.getServer('storage.dirPath'))
            .then( () => {
                return this.fileManager.ensureDirPath(this.sm.getServer('storage.dirPath'));
            });
    }

    writeServerBinaryFile(filePath, fileData){
        let destFilePath = path.join(this.sm.getServer('storage.dirPath'), filePath);
        return this.fileManager.writeBinaryFile(destFilePath, fileData);
    }

    unpackServerFile(filePath){
        let srcFilePath = path.join(this.sm.getServer('storage.dirPath'), filePath);
        return this.fileManager.unpackTarGz(srcFilePath, this.sm.getServer('storage.dirPath')).then( () => {
            return this.fileManager.removeFile(srcFilePath);
        });
    }

    readServerJsonFile(filePath){
        let srcFilePath = path.join(this.sm.getServer('storage.dirPath'), filePath);
        return this.fileManager.readJson(srcFilePath);
    }

    loadProxyURL(options){
        const proxyConfFilePath = this.sm.getProject('proxyConfig.filePath');
        return this.fileManager.ensureFilePath(proxyConfFilePath)
            .then( () => {
                return this.fileManager.readJson(proxyConfFilePath)
                    .then( jsonObj => {
                        let data = jsonObj;
                        if(options){
                            if(options.proxyURLDelete){
                                data.proxyURL = null;
                            } else if(options.proxyURL){
                                data.proxyURL = options.proxyURL;
                            }
                        }
                        return this.fileManager.writeJson(proxyConfFilePath, data)
                            .then( () => {
                                return data.proxyURL;
                            });
                    })
                    .catch( err => {
                        return this.fileManager.writeJson(proxyConfFilePath, { proxyURL: options.proxyURL })
                            .then( () => {
                                return options.proxyURL;
                            });
                    });
            });
    }

    readProjectConfig(){
        return this.fileManager.readJson(this.sm.getProject('config.filePath'));
    }

    writeProjectConfig(options){
        return this.fileManager.writeJson(this.sm.getProject('config.filePath'), options);
    }

    writeProjectBinaryFile(filePath, fileData){
        let destFilePath = path.join(this.sm.getProject('dirPath'), filePath);
        return this.fileManager.writeBinaryFile(destFilePath, fileData);
    }

    writeSourceFile(filePath, fileData){
        return this.fileManager.writeFile(filePath, fileData, false);
    }

    readSourceFile(filePath){
        return this.fileManager.readFile(filePath);
    }

    unpackProjectFile(filePath){
        let srcFilePath = path.join(this.sm.getProject('dirPath'), filePath);
        return this.fileManager.repackTarGzOmitRootDir(srcFilePath)
            .then( (tarFilePathTemp) => {
                return this.fileManager.unpackTar(tarFilePathTemp, this.sm.getProject('dirPath'))
                    .then( () => {
                        return this.fileManager.removeFile(tarFilePathTemp);
                    })
                    .then( () => {
                        return this.fileManager.removeFile(srcFilePath);
                    });
            });
    }

    readProjectJsonModel(){
        return this.fileManager.readJson(this.sm.getProject('model.filePath'));
    }

    writeProjectJsonModel(jsonObj){
        return this.fileManager.writeJson(this.sm.getProject('model.filePath'), jsonObj);
    }

    installPackages(){
        return new Promise( (resolve, reject) => {
            try{
                let child = exec('npm install', {cwd: this.sm.getProject('dirPath')},
                    (error, stdout, stderr) => {
                        if (error !== null) {
                            reject(error);
                        } else {
                            resolve()
                        }
                    });
            } catch(e){
                reject(e);
            }
        });
        //var execPath = path.join(projectDirPath, 'npm install');

    }

    compileProjectResources() {
        return this.installPackages()
            .then( () => {
                let pageForDeskFilePath = this.sm.getProject('pageForDesk.filePath');
                var nodeModulesPath = this.sm.getProject('nodeModules.dirPath');
                return this.compiler.stopWatchCompiler().then( () => {
                    return this.compiler.compile(pageForDeskFilePath, this.sm.getProject('desk.dirPath'), 'bundle.js', nodeModulesPath);
                });
            });
    }

    watchProjectResources(callback){
        return this.compiler.stopWatchCompiler()
            .then( () => {
                let pageForDeskFilePath = this.sm.getProject('pageForDesk.filePath');
                var nodeModulesPath = this.sm.getProject('nodeModules.dirPath');

                return this.compiler.watchCompiler(
                    pageForDeskFilePath, this.sm.getProject('desk.dirPath'), 'bundle.js', nodeModulesPath, callback
                )
            });
    }

    stopWatchProjectResources(){
        return this.compiler.stopWatchCompiler();
    }

    readDefaults(componentName){
        let lookupComponentName =
            isFirstCharacterInUpperCase(componentName) ? componentName : ('html-' + componentName);
        let filePath = path.join(this.sm.getProject('defaults.dirPath'), lookupComponentName + '.json');
        return this.fileManager.readJson(filePath)
            .catch( err => {
                return [];
            });
    }

    writeDefaults(componentName, modelObj){
        return this.fileManager.ensureDirPath(this.sm.getProject('defaults.dirPath'))
            .then( () => {
                return this.readDefaults(componentName);
            }).then( defaultsModel => {
                let defaults = defaultsModel;
                defaults.push(modelObj);
                let lookupComponentName =
                    isFirstCharacterInUpperCase(componentName) ? componentName : ('html-' + componentName);
                return this.fileManager.writeJson(
                    path.join(this.sm.getProject('defaults.dirPath'), lookupComponentName + '.json'), defaults
                );
            });
    }

    writeAllDefaults(componentName, modelObj){
        return this.fileManager.ensureDirPath(this.sm.getProject('defaults.dirPath'))
            .then( () => {
                let defaults = modelObj;
                let lookupComponentName =
                    isFirstCharacterInUpperCase(componentName) ? componentName : ('html-' + componentName);
                return this.fileManager.writeJson(
                    path.join(this.sm.getProject('defaults.dirPath'), lookupComponentName + '.json'), defaults
                );
            });
    }

    readProjectDocument(components){
        let documentObj = {
            overview: {},
            components: {}
        };
        let overviewFilePath = this.sm.getProject('docsOverview.filePath');
        return this.fileManager.ensureFilePath(overviewFilePath)
            .then( () => {
                return this.fileManager.readFile(overviewFilePath)
                    .then( fileData => {
                        fileData = fileData || 'Project does not have Readme';
                        documentObj.overview.markdown = fileData;
                    });
            })
            .then( () => {
                if(components && components.length > 0){
                    return components.reduce( (sequence, componentName) => {
                        return sequence.then( () => {
                            let componentNoteFilePath = path.join(this.sm.getProject('docsComponents.dirPath'), componentName + '.md');
                            return this.fileManager.ensureFilePath(componentNoteFilePath)
                                .then( () => {
                                    return this.fileManager.readFile(componentNoteFilePath)
                                        .then( fileData => {
                                            fileData = fileData || 'Component does not have notes';
                                            documentObj.components[componentName] = {
                                                markdown: fileData
                                            }
                                        });
                                });
                        });
                    }, Promise.resolve());
                }
            })
            .then( () => {
                return documentObj;
            });
    }

    copyProjectDocsToStaticContent(destDirName){
        //let overviewFilePath = path.join(this.docsDirPath, 'Readme.md');
        let destFilePath = path.join(this.sm.getProject('dirPath'), destDirName, 'public', 'docs');
        return this.fileManager.ensureDirPath(destFilePath)
            .then( () => {
                return this.fileManager.copyFile(this.sm.getProject('docs.dirPath'), destFilePath);
            });
    }

    writeProjectDocument(documentObj){
        if(documentObj.overview){
            let overviewFilePath = this.sm.getProject('docsOverview.filePath');
            documentObj.overview.markdown = documentObj.overview.markdown || 'Project does not have Readme';
            return this.fileManager.writeFile(overviewFilePath, documentObj.overview.markdown, false)
                .then( () => {
                    if(documentObj.components){
                        let sequence = Promise.resolve();
                        _.forOwn(documentObj.components, (component, componentName) => {
                            sequence = sequence.then( () => {
                                let componentNoteFilePath = path.join(this.sm.getProject('docsComponents.dirPath'), componentName + '.md');
                                component.markdown = component.markdown || 'Component does not have notes';
                                return this.fileManager.writeFile(componentNoteFilePath, component.markdown, false);
                            });
                        });
                        return sequence;
                    }
                });
        }
    }

    readComponentDocument(componentName){
        let componentNoteFilePath = path.join(this.sm.getProject('docsComponents.dirPath'), componentName + '.md');
        return this.fileManager.ensureFilePath(componentNoteFilePath)
            .then( () => {
                return this.fileManager.readFile(componentNoteFilePath)
                    .then( fileData => {
                        fileData = fileData || 'Component does not have notes';
                        return fileData;
                    });
            });
    }

    readProjectDir(){
        return this.fileManager.readDirectoryFlat(this.sm.getProject('dirPath'));
    }

    packProjectFiles(entries, destFileName){
        const destFilePath = path.join(this.sm.getProject('dirPath'), destFileName);
        return this.fileManager.removeFile(destFilePath).then( () => {
            return this.fileManager.packTarGz(this.sm.getProject('dirPath'), destFilePath, entries).then( () => {
                return destFilePath;
            });
        });
    }

    removeProjectFile(fileName){
        const destFilePath = path.join(this.sm.getProject('dirPath'), fileName);
        return this.fileManager.removeFile(destFilePath);
    }

    checkProjectDir(){
        return this.fileManager.checkDirIsEmpty(this.sm.getProject('dirPath'))
            .then( () => {
                return 'dir-is-empty';
            }).catch( err => {
                return this.fileManager.readDirectoryFlat(this.sm.getProject('dirPath'))
                    .then( foundObj => {
                        let requiredFiles = foundObj.files.filter( file => {
                            return (file && (file.name === 'package.json'
                            || file.name === 'node_modules'));
                        });
                        if(requiredFiles.length !== 2){
                            throw Error('Directory ' + this.sm.getProject('dirPath') + ' does not have package.json or node_modules.');
                        }
                    })
                    .then( () => {
                        return this.fileManager.readDirectoryFlat(this.sm.getProject('builder.dirPath'))
                            .then( foundObj => {
                                let requiredFiles = foundObj.files.filter( file => {
                                    return (file && (file.name === 'desk'
                                    || file.name === 'defaults'
                                    || file.name === 'generators'
                                    || file.name === 'src'
                                    || file.name === 'templates'));
                                });
                                if(requiredFiles.length === 5){
                                    return 'ready-to-go';
                                } else {
                                    throw Error('Directory ' + this.sm.getProject('builder.dirPath') + ' has corrupted structure.');
                                }
                            });
                    }).catch( err => {
                        throw Error(err);
                    });
            });
    }

}

export default StorageManager;
