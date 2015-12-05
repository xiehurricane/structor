
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
import IndexManager from './IndexManager.js';
import * as modelParser from './ModelParser.js';
import * as pathResolver from './PathResolver.js';
import * as formatter from './FileFormatter.js';

class ExportManager {


    constructor(sm){

        this.sm = sm;
        this.fileManager = new FileManager();

    }

    createPageDataObject(pageModel, indexObj){
        let dataObj = {
            model: pageModel,
            pageName: pageModel.pageName,
            pageTitle: pageModel.pageTitle,
            pageMetaInfo: pageModel.pageProps,
            bodyScript: pageModel.pageScript,
            imports: []
        };

        let modelComponentMap = modelParser.getModelComponentMap(_.extend(pageModel, {type: pageModel.pageName}));
        if(indexObj.groups){

            _.forOwn(indexObj.groups, (value, prop) => {
                if(value.components && value.components.length > 0){
                    value.components.map((componentInIndex) => {
                        if(modelComponentMap[componentInIndex.name]){
                            dataObj.imports.push({
                                name: componentInIndex.name,
                                source: componentInIndex.source,
                                member: componentInIndex.member
                            });
                        }
                    });
                }
            });
        }

        return dataObj;
    }

    createResourcesDataObject(indexObj){
        let dataObj = {

            requires: []
        };
        if(indexObj.requires && indexObj.requires.length > 0){
            indexObj.requires.map( require => {
                dataObj.requires.push({
                        source: require.source
                });
            });
        }
        return dataObj;
    }

    createProjectDataObject(projectModel, destDirPath, indexObj){
        let projectDataObj = {
            outputDirPath: path.join(this.sm.getProject('dirPath'), destDirPath),
            indexFilePath: this.sm.getProject('index.filePath'),
            pages:[]
        };
        let resources = this.createResourcesDataObject(indexObj);
        if(projectModel && projectModel.pages && projectModel.pages.length > 0){
            projectModel.pages.forEach( (page, index) => {
                let pageDataObject = this.createPageDataObject(page, indexObj);
                pageDataObject.resources = resources;
                projectDataObj.pages.push(pageDataObject);
            });
        } else {
            throw Error('Project does not have pages.');
        }
        projectDataObj = pathResolver.resolveFromProjectPerspective(projectDataObj);
        return projectDataObj;
    }

    doGeneration(projectModel, destDirPath, indexObj){

        let generatedObject = {
            pages: []
        };

        let projectDataObj = this.createProjectDataObject(projectModel, destDirPath, indexObj);

        return this.fileManager.readDirectory(this.sm.getProject('templates.dirPath'))
            .then( found => {
                if(!found.files || found.files.length <= 0){
                    throw Error('Current project does not have a templates for export.');
                }
                return found.files.reduce(
                    (sequence, filePath) => {
                        return sequence.then( templateObjects => {
                            let _templateObjects = templateObjects || [];
                            const ext = path.extname(filePath);
                            if(ext === '.tpl'){
                                return this.fileManager.readFile(filePath)
                                    .then( fileData => {
                                        _templateObjects.push({
                                            dirPath: path.dirname(filePath),
                                            filePath: filePath,
                                            outputFileName: path.basename(filePath, '.tpl'),
                                            templateObj: _.template(fileData)
                                        });
                                        return _templateObjects;
                                    });
                            } else {
                                return _templateObjects;
                            }
                        }).catch( err => {
                            throw Error(err.message + '. Broken export template file: ' + filePath);
                        });
                    },
                    Promise.resolve()
                );
            })
            .then( templateObjects => {
                generatedObject.outputDirPath = projectDataObj.outputDirPath;
                templateObjects.forEach( obj => {
                    //console.log(JSON.stringify(obj, null, 4));

                    if(obj.outputFileName.indexOf('{pagename}') >= 0){
                        projectDataObj.pages.forEach( (page, index) => {
                            let pageName = obj.outputFileName.replace('{pagename}', page.pageName);
                            generatedObject.pages.push({
                                pageOutputFilePath: path.join(projectDataObj.outputDirPath, pageName),
                                pageSourceCode: obj.templateObj(page)
                            });
                        });
                    } else {
                        generatedObject.pages.push({
                            pageOutputFilePath: path.join(projectDataObj.outputDirPath, obj.outputFileName),
                            pageSourceCode: obj.templateObj(projectDataObj)
                        });
                    }

                });
                return generatedObject;
            });


        //let projectPageTemplateFilePath = path.join(this.sm.getProject('siteTemplates.dirPath'), 'Page.tpl');
        //let projectHtmlTemplateFilePath = path.join(this.sm.getProject('siteTemplates.dirPath'), 'Html.tpl');
        //let pageTemplateFilePath = path.join(this.sm.getServer('siteTemplates.dirPath'), 'Page.tpl');
        //let htmlTemplateFilePath = path.join(this.sm.getServer('siteTemplates.dirPath'), 'Html.tpl');
        //let pageTemplate = null;
        //let htmlTemplate = null;
        //return this.fileManager.readFile(projectPageTemplateFilePath)
        //    .then( fileData => {
        //        pageTemplate = _.template(fileData);
        //    })
        //    .catch( () => {
        //        return this.fileManager.readFile(pageTemplateFilePath)
        //            .then( fileData => {
        //                pageTemplate = _.template(fileData);
        //            });
        //    })
        //    .then( () => {
        //        return this.fileManager.readFile(projectHtmlTemplateFilePath)
        //            .then( fileData => {
        //                htmlTemplate = _.template(fileData);
        //            })
        //            .catch( () => {
        //                return this.fileManager.readFile(htmlTemplateFilePath)
        //                    .then( fileData => {
        //                        htmlTemplate = _.template(fileData);
        //                    });
        //            });
        //    })
        //    .then( () => {
        //        generatedObject.staticDirPath = projectDataObj.staticDirPath;
        //        generatedObject.bundleDirPath = projectDataObj.bundleDirPath;
        //        projectDataObj.pages.forEach( (page, index) => {
        //            generatedObject.pages.push({
        //                pageOutputFilePath: path.join(projectDataObj.outputDirPath, page.pageName + '.js'),
        //                pageSourceCode: pageTemplate(page),
        //                htmlOutputFilePath: path.join(projectDataObj.bundleDirPath, page.pageName  + '.html'),
        //                htmlSourceCode: htmlTemplate(page),
        //                bundleFileName: page.pageName
        //            });
        //        });
        //        return generatedObject;
        //    });
    }

    commitGeneration(generatedObj){

        let sequence = Promise.resolve();

        sequence = sequence.then(() => {
            return this.fileManager.removeFile(generatedObj.outputDirPath);
        });

        generatedObj.pages.forEach( (page, index) => {
            sequence = sequence.then(() => {
                return this.fileManager.ensureFilePath(page.pageOutputFilePath)
                    .then(() => {
                        const ext = path.extname(page.pageOutputFilePath);
                        return this.fileManager.writeFile(
                            page.pageOutputFilePath,
                            page.pageSourceCode,
                            ext === '.js'
                        );
                    });
            });
        });

        return sequence;
    }

}

export default ExportManager;