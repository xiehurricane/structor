
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
import express from 'express';
import rewrite from 'express-urlrewrite';
import path from 'path';
import bodyParser from 'body-parser';
import httpProxy from 'http-proxy';

//let app = null;
//let socket = null;
//let server = null;
//let io = null;
//let proxy = null;
//
//
//let socketClient = null;
//let proxyURL = null;
const builderPackFileName = 'builder.tar.gz';
const appPackFileName = '__app.tar.gz';
const modelFileName = 'model.json';
const servicePath = '/.service';

import StateManager from './StateManager.js';
import IndexManager from './IndexManager.js';
import GeneratorManager from './GeneratorManager.js';
import StorageManager from './StorageManager.js';
import ClientManager from './ClientManager.js';
import Validator from './Validator.js';
import StaticSiteManager from './StaticSiteManager.js';
import ExportManager from './ExportManager.js';
import LivePreviewManager from './LivePreviewManager.js';
import MiddlewareCompilerManager from './MiddlewareCompilerManager.js';

class Api {

    constructor(systemEnv){

        this.systemEnv = systemEnv;

        this.stateManager = new StateManager();
        this.stateManager.setServerDir(this.systemEnv.serverDir);
        this.stateManager.setProjectDir(this.systemEnv.projectDir);

        this.storageManager = new StorageManager(this.stateManager);
        this.indexManager = new IndexManager(this.stateManager);
        this.generatorManager = new GeneratorManager(this.stateManager, this.indexManager);
        this.staticSiteManager = new StaticSiteManager(this.stateManager);
        this.exportManager = new ExportManager(this.stateManager);
        this.livePreviewManager = new LivePreviewManager(this.stateManager);
        this.clientManager = new ClientManager(this.stateManager);
        this.middlewareCompilerManager = new MiddlewareCompilerManager(this.stateManager);
        this.validator = new Validator();

        this.app = express();
        // use middleware body parsers only for certain routes, because of the proxying post request is hanging
        this.app.use('/structor', express.static(path.join(this.systemEnv.serverDir, 'static')));
        this.app.post('/invoke', bodyParser.json({limit: '50mb'}), (req, res) => {
            let methodName = req.body.methodName;
            let data = req.body.data || {};
            this[methodName](data)
                .then( response => {
                    res.send({ data: response });
                })
                .catch( err => {
                    let errorMessage = err.message ? err.message : err;
                    res.send({ error: true, errors: [errorMessage] });
                });
        });

        this.server = this.app.listen(this.systemEnv.portNumber, () => {
            console.log(
                'Structor started successfully.\nPlease go to http://localhost:%d/structor',
                this.server.address().port
            );
            if(this.systemEnv.io){
                this.socket = this.systemEnv.io(this.server);
                this.socket.on('connection', socket => {
                    this.socketClient = socket;
                    this.socketClient.emit('invitation', 'Hello from server.');
                });
            }
        });

    }

    static initServer(options){
        let systemConfig = {
            serverDir: options.dirname,
            projectDir: options.workingDirname,
            portNumber: options.portNumber,
            io: options.io
        };
        return new Api(systemConfig);
    }

    checkProjectDir(options){
        return this.storageManager.checkProjectDir();
    }

    test(options){
        return new Promise( (resolve, reject) => {
            if(options){
                resolve(options);
            } else {
                reject('Data was not specified.');
            }
        });
    }

    initUserCredentials(options){
        return this.clientManager.initUserCredentials(options);
    }

    removeUserCredentials(options){
        return this.clientManager.removeUserCredentials();
    }

    loadUserProfile(options){
        return this.clientManager.loadUserProfile();
    }

    createUserProfile(options){
        return this.clientManager.createUserProfile(options);
    }

    readConfiguration(options){
        return this.storageManager.readServerConfig();
    }

    storeConfiguration(options){
        return this.storageManager.writeServerConfig(options);
    }

    readLocalConfiguration(options){
        return this.storageManager.readProjectConfig();
    }

    storeLocalConfiguration(options){
        return this.storageManager.writeProjectConfig(options);
    }

    getPackageConfig(options){
        return this.storageManager.readPackageConfig();
    }

    setProjectProxy(options){
        return this.storageManager.loadProxyURL(options)
            .then( proxyURL => {
                //console.log(proxyURL);
                this.proxyURL = proxyURL;

                if(!this.proxy){
                    this.proxy = httpProxy.createProxyServer({});
                    this.proxy.on('error', (err, req, res) => {
                        let statusText = 'Proxy server error connecting to ' + this.proxyURL + req.url + " " + JSON.stringify(err);
                        res.writeHead(500, statusText);
                        res.end(statusText);
                        console.log(statusText);
                    });
                    //
                    this.app.all('/*', (req, res, next) => {
                        let url = req.url;
                        //console.log('Request: ' + url);
                        if (url.indexOf('/structor') === 0 || url.indexOf('/invoke') === 0 || url.indexOf('/desk') === 0) {
                            next('route');
                        } else {
                            if(this.proxyURL && this.proxyURL.length > 0){
                                this.proxy.web(req, res, { target: this.proxyURL });
                            } else {
                                next('route');
                            }
                        }
                    });
                    //this.app.get('/*', (req, res, next) => {
                    //    if (req.url.indexOf(servicePath) === 0) {
                    //        next('route');
                    //    } else {
                    //        if(this.proxyURL && this.proxyURL.length > 0){
                    //            this.proxy.web(req, res, { target: this.proxyURL });
                    //        } else {
                    //            next('route');
                    //        }
                    //    }
                    //});
                }
                return { proxyURL: this.proxyURL };
            });
    }

    getProjectGallery(options){
        return this.clientManager.getAllProjects(options);
    }

    /**
     * Valid
     * @param options
     * @returns {Promise.<T>}
     */
    downloadProject(options) {
        return this.validator.validateOptions(options, ['downloadUrl'])
            .then( () => {
                return this.clientManager.downloadGalleryFile(options.downloadUrl);
            })
            .then( fileBody => {
                return this.storageManager.writeProjectBinaryFile(appPackFileName, fileBody);
            })
            .then( () => {
                return this.storageManager.unpackProjectFile(appPackFileName);
            })
            .then( () => {
                return this.storageManager.compileProjectResources();
            })
            .then( () => {
                return 'ready-to-go';
            });

    }

    openLocalProject(options){
        let response = {};
        return this.storageManager.readProjectJsonModel()
            .then(jsonModel => {
                response.model = jsonModel;
            })
            .then( () => {
                return this.indexManager.getComponentsTree()
                    .then( componentsTree => {
                        response.componentsTree = componentsTree;
                    });
            })
            .then( () => {
                this.app.use(this.middlewareCompilerManager.getDevMiddleware());
                this.app.use(this.middlewareCompilerManager.getHotMiddleware());
                this.app.use(this.middlewareCompilerManager.getBuilderMiddleware({
                    callback: stats => {
                        this.socketClient.emit('compiler.message', stats);
                    }
                }));
                this.app.use(rewrite('/deskpage/*', '/desk/index.html'));
                this.app.use('/desk', express.static(this.stateManager.getProject('desk.dirPath')));
                return this.setProjectProxy({});
            })
            .then( () => {
                return response;
            });
    }

    getComponentsTree(options){
        return this.indexManager.getComponentsTree()
            .then( componentsTree => {
                return {
                    componentsTree: componentsTree
                }
            });
    }

    readProjectFiles(options){
        return this.storageManager.readProjectDir();
    }

    //checkCreateProject(options){
    //    return this.validator.validateOptions(options, ['projectName'])
    //        .then( () => {
    //            return this.clientManager.checkCreateProject({ projectName: options.projectName });
    //        });
    //}

    //createProject(options){
    //    return this.validator.validateOptions(options,
    //        ['projectName', 'projectDescription', 'projectLicense', 'files', 'pageContents', 'projectModel'])
    //        .then( () => {
    //            let projectGallery = {
    //                projectName: options.projectName,
    //                description: options.projectDescription,
    //                license: options.projectLicense
    //            };
    //            let entries = [];
    //            if(options.files && options.files.length > 0){
    //                options.files.map(file => {
    //                    if(file.checked === true){
    //                        entries.push(file.name);
    //                    }
    //                });
    //            }
    //
    //            const staticContentDirName = '__static_preview_content';
    //            const appDestFileName = '__app.tar.gz';
    //            const staticDestFileName = '__preview.tar.gz';
    //            let projectData = null;
    //            let applicationPackageFilePath = null;
    //            let previewPackageFilePath = null;
    //
    //            return this.clientManager.createProject(projectGallery)
    //                .then( projectObj => {
    //                    projectData = projectObj;
    //                    return this.indexManager.initIndex()
    //                        .then( indexObj => {
    //                            return this.staticSiteManager.doGeneration(
    //                                options.projectModel, staticContentDirName, indexObj, options.pageContents)
    //                                .then( generatedObj => {
    //                                    return this.staticSiteManager.commitGeneration(generatedObj);
    //                                });
    //                        })
    //                })
    //                .then( () => {
    //                    return this.storageManager.copyProjectDocsToStaticContent(staticContentDirName);
    //                })
    //                .then( () => {
    //                    return this.storageManager.packProjectFiles(entries, appDestFileName);
    //                })
    //                .then( filePath => {
    //                    applicationPackageFilePath = filePath;
    //                    return this.storageManager.packProjectFiles([staticContentDirName], staticDestFileName);
    //                })
    //                .then( filePath => {
    //                    previewPackageFilePath = filePath;
    //                    return this.clientManager.uploadProjectFiles({
    //                        projectId: projectData.id,
    //                        filePaths: [applicationPackageFilePath, previewPackageFilePath]
    //                    });
    //                })
    //                .then( () => {
    //                    return this.storageManager.removeProjectFile(staticContentDirName)
    //                        .then( () => {
    //                            return this.storageManager.removeProjectFile(appDestFileName);
    //                        })
    //                        .then( () => {
    //                            return this.storageManager.removeProjectFile(staticDestFileName);
    //                        });
    //                })
    //                .catch( err => {
    //                    return this.storageManager.removeProjectFile(staticContentDirName)
    //                        .then( () => {
    //                            return this.storageManager.removeProjectFile(appDestFileName);
    //                        })
    //                        .then( () => {
    //                            return this.storageManager.removeProjectFile(staticDestFileName);
    //                        })
    //                        .then( () => {
    //                            throw Error(err);
    //                        });
    //                });
    //        });
    //}

    saveProjectModel(options){
        return this.storageManager.writeProjectJsonModel(options.model);
    }

    watchLocalProject(options) {
        return this.storageManager.watchProjectResources((err, data) => {
            let response = {};
            if (err) {
                this.socketClient.emit('compilerWatcher.errors', err);
            } else {
                response = _.extend(response, data);
                this.indexManager.getComponentsTree()
                    .then(componentsTree => {
                        response.componentsTree = componentsTree;
                    })
                    .then( () => {
                        var componentsNames = this.indexManager.getComponentsNamesFromTree(response.componentsTree);
                        return this.storageManager.readProjectDocument(componentsNames)
                            .then( documentObj => {
                                response.projectDocument = documentObj;
                            });
                    })
                    .then( () => {
                        this.socketClient.emit('compilerWatcher.success', response);
                    })
                    .catch(err => {
                        this.socketClient.emit('compilerWatcher.errors', err);
                    });
            }
        });
    }

    stopWatchLocalProject(options){
        return this.storageManager.stopWatchProjectResources();
    }

    loadComponentDefaults(options){
        return this.storageManager.readDefaults(options.componentName);
    }

    saveComponentDefaults(options){
        return this.storageManager.writeDefaults(options.componentName, options.componentOptions);
    }

    saveAllComponentDefaults(options){
        return this.storageManager.writeAllDefaults(options.componentName, options.defaults);
    }

    // todo: refactor method, move logic into manager
    deleteComponentDefaultsByIndex(options){
        return this.validator.validateOptions(options, ['componentName', 'defaultsIndex'])
            .then( () => {
                return this.storageManager.readDefaults(options.componentName);
            })
            .then( componentDefaults => {
                const index = parseInt(options.defaultsIndex);
                if(index >= 0 && componentDefaults && index < componentDefaults.length && componentDefaults.length > 1){
                    componentDefaults.splice(index, 1);
                    return componentDefaults;
                }
                throw Error('Can not delete the last variant.');
            })
            .then( newComponentDefaults => {
                return this.storageManager.writeAllDefaults(options.componentName, newComponentDefaults)
                    .then( () => {
                        return newComponentDefaults;
                    });
            });
    }

    // todo: refactor method, move logic into manager
    addComponentDefaults(options){
        return this.validator.validateOptions(options, ['componentName', 'defaultsModel'])
            .then( () => {
                return this.storageManager.readDefaults(options.componentName);
            })
            .then( componentDefaults => {
                if(!componentDefaults || componentDefaults.length <= 0){
                    componentDefaults = [];
                }
                componentDefaults.push(options.defaultsModel);
                return componentDefaults;
            })
            .then( newComponentDefaults => {
                return this.storageManager.writeAllDefaults(options.componentName, newComponentDefaults)
                    .then( () => {
                        return newComponentDefaults;
                    });
            });
    }

    getGeneratorList(options){
        return this.generatorManager.getGeneratorList();
    }

    getGenerationMetaInf(options){
        return this.validator.validateOptions(options, ['componentName', 'componentGroup', 'componentModel', 'generatorName'])
            .then( () => {
                const { componentModel, generatorName, componentName, componentGroup: groupName, meta } = options;
                return this.generatorManager.doPreGeneration(
                    componentModel,
                    generatorName,
                    {
                        componentName,
                        groupName
                    }
                )
                    .then( metaInfoObj => {
                        return metaInfoObj;
                    });
            });
    }

    generateComponentCode(options){
        return this.validator.validateOptions(options, ['componentName', 'componentGroup', 'componentModel', 'generatorName', 'meta'])
            .then( () => {
                const { componentModel, generatorName, componentName, componentGroup: groupName, meta } = options;
                return this.generatorManager.doGeneration(
                    componentModel,
                    generatorName,
                    {
                        componentName,
                        groupName
                    },
                    meta
                )
                    .then( generatedObj => {
                        return generatedObj;
                    });
            });
    }

    commitComponentCode(options){
        return this.generatorManager.commitGeneration(options);
    }

    rewriteComponentCode(options){
        return this.validator.validateOptions(options, ['filePath', 'sourceCode'])
            .then( () => {
                return this.validator.validateJSCode(options.sourceCode);
            })
            .then( () => {
                return this.storageManager.writeSourceFile(options.filePath, options.sourceCode);
            });
    }

    readComponentCode(options){
        return this.validator.validateOptions(options, ['filePath'])
            .then( () => {
                return this.storageManager.readSourceFile(options.filePath);
            });

    }

    readComponentDocument(options){
        return this.validator.validateOptions(options, ['componentName'])
            .then( () => {
                return this.indexManager.getComponentsNames();
            })
            .then( componentsNames => {
                if(_.includes(componentsNames, options.componentName)){
                    return this.storageManager.readComponentDocument(options.componentName);
                }
            });
    }

    readProjectDocument(options){
        return this.indexManager.getComponentsNames()
            .then( componentsNames => {
                return this.storageManager.readProjectDocument(componentsNames);
            });
    }

    writeProjectDocument(options){
        return this.validator.validateOptions(options, ['projectDocument'])
            .then( () => {
                return this.storageManager.writeProjectDocument(options.projectDocument);
            });
    }

    generateStaticSite(options){
        return this.validator.validateOptions(options, ['projectModel', 'pageContents', 'destDirName'])
            .then( () => {
                return this.indexManager.initIndex()
                    .then( indexObj => {
                        return this.staticSiteManager.doGeneration(
                            options.projectModel, options.destDirName, indexObj, options.pageContents
                        )
                            .then( generatedObj => {
                                //console.log(JSON.stringify(generatedObj, null, 4));

                                return this.staticSiteManager.commitGeneration(generatedObj);

                            });
                    });
            });
    }

    exportPages(options){
        return this.validator.validateOptions(options, ['projectModel'])
            .then( () => {
                return this.storageManager.writeProjectJsonModel(options.projectModel);
            })
            .then( () => {
                return this.storageManager.readProjectConfig();
            })
            .then( projectConfObj => {
                return this.indexManager.initIndex()
                    .then( indexObj => {
                        return this.exportManager.doGeneration(options.projectModel, projectConfObj.exportDirPath, indexObj)
                            .then( generatedObj => {
                                //console.log(JSON.stringify(generatedObj, null, 4));

                                return this.exportManager.commitGeneration(generatedObj);

                            });
                    });
            })
    }

    generateLivePreview(options){
        return this.validator.validateOptions(options, ['projectModel'])
            .then( () => {
                return this.livePreviewManager.doGeneration(options.projectModel);
            }).then( () => {
                return this.htmlURLPrefix + '/live-preview';
            });
    }



}

export default Api;
