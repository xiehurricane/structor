
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
import ProjectCompiler from './ProjectCompiler.js';

const configFileName = 'react-ui-builder.json';
const templateDirName = 'templates';
const storageDirName = '.data';
const builderDirName = '.builder';
const buildDirName = 'build';
const generatorsDirName = 'generators';
const sourceDirName = 'src';
const scriptsDirName = 'scripts';
const docsDirName = 'docs';
const fileConfigName = 'config.json';
const indexFileName = 'index.js';
const npmPackageFileName = 'package.json';
const previewTemplateDirName = 'live-preview';

class LivePreviewManager {


    constructor(serverDirPath){

        this.serverDirPath = serverDirPath;
        this.serverConfigFilePath = path.join(this.serverDirPath, configFileName);
        this.serverTemplateDirPath = path.join(this.serverDirPath, templateDirName);
        this.packageFilePath = path.join(this.serverDirPath, npmPackageFileName);
        this.storageDirPath = path.join(this.serverDirPath, storageDirName);
        this.previewTemplateDirPath = path.join(this.serverTemplateDirPath, previewTemplateDirName);

        this.fileManager = new FileManager();
        this.compiler = new ProjectCompiler();

    }

    setProjectDirPath(projectDirPath){
        this.projectDirPath = projectDirPath;
        this.builderDirPath = path.join(projectDirPath, builderDirName);
        this.buildDirPath = path.join(this.builderDirPath, buildDirName);
        this.generatorsDirPath = path.join(this.builderDirPath, generatorsDirName);
        this.sourceDirPath = path.join(this.builderDirPath, sourceDirName);
        this.indexFilePath = path.join(this.sourceDirPath, indexFileName);
        this.docsDirPath = path.join(this.builderDirPath, docsDirName);
        this.scriptsDirName = scriptsDirName;
        this.configFilePath = path.join(this.builderDirPath, fileConfigName);
    }

    createPageDataObject(pageModel, indexObj){
        let dataObj = {
            model: pageModel,
            pageName: pageModel.pageName,
            pageTitle: pageModel.pageTitle,
            pageMetaInfo: pageModel.pageMetaInfo,
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

    createProjectDataObject(projectModel, indexObj, pageContents){
        let projectDataObj = {
            outputDirPath: path.join(this.buildDirPath, 'live-preview'),
            indexFilePath: this.indexFilePath,
            pages:[]
        };
        if(projectModel && projectModel.pages && projectModel.pages.length > 0){
            projectModel.pages.map( (page, index) => {
                if(pageContents[page.pageName]){
                    let pageDataObject = this.createPageDataObject(page, indexObj);
                    pageDataObject.isIndexPage = pageContents[page.pageName].isIndexPage;
                    projectDataObj.pages.push(pageDataObject);
                }
            });
        } else {
            throw Error('Project does not have pages.');
        }
        projectDataObj.resources = this.createResourcesDataObject(indexObj);
        projectDataObj = pathResolver.resolveFromProjectPerspective(projectDataObj);
        return projectDataObj;
    }

    doGeneration(projectModel, indexObj, pageContents){

        let generatedObject = {
            pages: []
        };

        let projectDataObj = this.createProjectDataObject(projectModel, indexObj, pageContents);

        let pageTemplateFilePath = path.join(this.previewTemplateDirPath, 'Page.tpl');
        let htmlTemplateFilePath = path.join(this.previewTemplateDirPath, 'Html.tpl');
        let resourcesTemplateFilePath = path.join(this.previewTemplateDirPath, 'Resources.tpl');
        let pageTemplate = null;
        let htmlTemplate = null;
        let resourcesTemplate = null;
        return this.fileManager.readFile(pageTemplateFilePath)
            .then( fileData => {
                pageTemplate = _.template(fileData);
            })
            .then( () => {
                return this.fileManager.readFile(htmlTemplateFilePath)
                    .then( fileData => {
                        htmlTemplate = _.template(fileData);
                    });
            })
            .then( () => {
                return this.fileManager.readFile(resourcesTemplateFilePath)
                    .then( fileData => {
                        resourcesTemplate = _.template(fileData);
                    });
            })
            .then( () => {
                generatedObject.outputDirPath = projectDataObj.outputDirPath;
                projectDataObj.pages.map( (page, index) => {
                    var htmlPageName = page.isIndexPage ? 'index' : page.pageName;
                    generatedObject.pages.push({
                        pageOutputFilePath: path.join(projectDataObj.outputDirPath, page.pageName + '.js'),
                        pageSourceCode: pageTemplate(page),
                        htmlOutputFilePath: path.join(projectDataObj.outputDirPath, htmlPageName  + '.html'),
                        htmlSourceCode: htmlTemplate(page),
                        bundleFileName: page.pageName
                    });
                });
                generatedObject.resources = {
                    outputFilePath: path.join(projectDataObj.outputDirPath, 'resources.js'),
                    sourceCode: resourcesTemplate(projectDataObj.resources),
                    bundleFileName: 'resources.bundle.js'
                };
                return generatedObject;
            });
    }

    commitGeneration(generatedObj){

        var nodeModulesPath = path.join(this.projectDirPath, 'node_modules');

        let sequence = Promise.resolve();

        sequence = sequence.then(() => {
            return this.fileManager.removeFile(generatedObj.outputDirPath);
        });

        sequence = sequence.then( () => {
            return this.fileManager.ensureFilePath(generatedObj.resources.outputFilePath)
                .then(() => {
                    return this.fileManager.writeFile(
                        generatedObj.resources.outputFilePath,
                        generatedObj.resources.sourceCode,
                        true
                    );
                })
                .then( () => {
                    return this.compiler.compileNotOptimized(
                        generatedObj.resources.outputFilePath,
                        generatedObj.outputDirPath,
                        generatedObj.resources.bundleFileName,
                        nodeModulesPath
                    );
                });
        });

        generatedObj.pages.map( (page, index) => {
            sequence = sequence.then(() => {
                return this.fileManager.ensureFilePath(page.pageOutputFilePath)
                    .then(() => {
                        return this.fileManager.writeFile(
                            page.pageOutputFilePath,
                            page.pageSourceCode,
                            true
                        );
                    })
                    .then( () => {
                        return this.fileManager.ensureFilePath(page.htmlOutputFilePath)
                    })
                    .then(() => {
                        return this.fileManager.writeFile(
                            page.htmlOutputFilePath,
                            page.htmlSourceCode,
                            false
                        );
                    });
            });
        });

        sequence = sequence.then( () => {
            var entries = {};
            generatedObj.pages.map( (page, index) => {
                entries[page.bundleFileName] = page.pageOutputFilePath;
            });
            return this.compiler.compileNotOptimized(
                entries,
                generatedObj.outputDirPath,
                '[name].bundle.js',
                nodeModulesPath,
                true
            );
        });

        sequence = sequence.then( () => {

            return 'live-preview/index.html'
        });

        return sequence;
    }

}

export default LivePreviewManager;