
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
const siteTemplateDirName = 'static-site';

class StaticSiteManager {


    constructor(sm){

        this.sm = sm;
        //this.serverDirPath = serverDirPath;
        //this.serverConfigFilePath = path.join(this.serverDirPath, configFileName);
        //this.serverTemplateDirPath = path.join(this.serverDirPath, templateDirName);
        //this.packageFilePath = path.join(this.serverDirPath, npmPackageFileName);
        //this.storageDirPath = path.join(this.serverDirPath, storageDirName);
        //this.siteTemplateDirPath = path.join(this.serverTemplateDirPath, siteTemplateDirName);

        this.fileManager = new FileManager();
        this.compiler = new ProjectCompiler();

    }

    //setProjectDirPath(projectDirPath){
    //    this.projectDirPath = projectDirPath;
    //    this.builderDirPath = path.join(projectDirPath, builderDirName);
    //    this.buildDirPath = path.join(this.builderDirPath, buildDirName);
    //    this.generatorsDirPath = path.join(this.builderDirPath, generatorsDirName);
    //    this.sourceDirPath = path.join(this.builderDirPath, sourceDirName);
    //    this.indexFilePath = path.join(this.sourceDirPath, indexFileName);
    //    this.docsDirPath = path.join(this.builderDirPath, docsDirName);
    //    this.projectTemplateDirPath = path.join(this.builderDirPath, templateDirName);
    //    this.projectSiteTemplateDirPath = path.join(this.projectTemplateDirPath, siteTemplateDirName);
    //    this.scriptsDirName = scriptsDirName;
    //    this.configFilePath = path.join(this.builderDirPath, fileConfigName);
    //}

    createPageDataObject(pageModel, indexObj){
        let dataObj = {
            model: pageModel,
            pageName: pageModel.pageName,
            pageTitle: pageModel.pageTitle,
            pageMetaInfo: pageModel.pageMetaInfo,
            bodyScript: pageModel.bodyScript,
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

    createProjectDataObject(projectModel, destDirPath, indexObj, pageContents){
        let projectDataObj = {
            staticDirPath: path.join(this.sm.getProject('dirPath'), destDirPath),
            outputDirPath: path.join(this.sm.getProject('dirPath'), destDirPath, 'src'),
            bundleDirPath: path.join(this.sm.getProject('dirPath'), destDirPath, 'public'),
            indexFilePath: this.sm.getProject('index.filePath'),
            pages:[]
        };
        let resources = this.createResourcesDataObject(indexObj);
        if(projectModel && projectModel.pages && projectModel.pages.length > 0){
            projectModel.pages.map( (page, index) => {
                if(pageContents[page.pageName]){
                    let pageDataObject = this.createPageDataObject(page, indexObj);
                    pageDataObject.htmlContent = pageContents[page.pageName].htmlContent;
                    pageDataObject.isIndexPage = pageContents[page.pageName].isIndexPage;
                    pageDataObject.resources = resources;
                    projectDataObj.pages.push(pageDataObject);
                }
            });
        } else {
            throw Error('Project does not have pages.');
        }
        projectDataObj = pathResolver.resolveFromProjectPerspective(projectDataObj);
        return projectDataObj;
    }

    doGeneration(projectModel, destDirPath, indexObj, pageContents){

        let generatedObject = {
            pages: []
        };

        let projectDataObj = this.createProjectDataObject(projectModel, destDirPath, indexObj, pageContents);
        let projectPageTemplateFilePath = path.join(this.sm.getProject('siteTemplates.dirPath'), 'Page.tpl');
        let projectHtmlTemplateFilePath = path.join(this.sm.getProject('siteTemplates.dirPath'), 'Html.tpl');
        let pageTemplateFilePath = path.join(this.sm.getServer('siteTemplates.dirPath'), 'Page.tpl');
        let htmlTemplateFilePath = path.join(this.sm.getServer('siteTemplates.dirPath'), 'Html.tpl');
        let pageTemplate = null;
        let htmlTemplate = null;
        return this.fileManager.readFile(projectPageTemplateFilePath)
            .then( fileData => {
                pageTemplate = _.template(fileData);
            })
            .catch( () => {
                return this.fileManager.readFile(pageTemplateFilePath)
                    .then( fileData => {
                        pageTemplate = _.template(fileData);
                    });
            })
            .then( () => {
                return this.fileManager.readFile(projectHtmlTemplateFilePath)
                    .then( fileData => {
                        htmlTemplate = _.template(fileData);
                    })
                    .catch( () => {
                        return this.fileManager.readFile(htmlTemplateFilePath)
                            .then( fileData => {
                                htmlTemplate = _.template(fileData);
                            });
                    });
            })
            .then( () => {
                generatedObject.staticDirPath = projectDataObj.staticDirPath;
                generatedObject.bundleDirPath = projectDataObj.bundleDirPath;
                projectDataObj.pages.map( (page, index) => {
                    var htmlPageName = page.isIndexPage ? 'index' : page.pageName;
                    generatedObject.pages.push({
                        pageOutputFilePath: path.join(projectDataObj.outputDirPath, page.pageName + '.js'),
                        pageSourceCode: pageTemplate(page),
                        htmlOutputFilePath: path.join(projectDataObj.bundleDirPath, htmlPageName  + '.html'),
                        htmlSourceCode: htmlTemplate(page),
                        bundleFileName: page.pageName
                    });
                });
                return generatedObject;
            });
    }

    commitGeneration(generatedObj){

        var nodeModulesPath = this.sm.getProject('nodeModules.dirPath');

        let sequence = Promise.resolve();

        sequence = sequence.then(() => {
            return this.fileManager.removeFile(generatedObj.staticDirPath);
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
            return this.compiler.compileOptimized(
                entries,
                generatedObj.bundleDirPath,
                '[name].bundle.js',
                nodeModulesPath,
                true
            );
        });

        return sequence;
    }

}

export default StaticSiteManager;