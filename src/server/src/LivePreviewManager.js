
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


    constructor(sm){

        this.sm = sm;

        //this.serverDirPath = serverDirPath;
        //this.serverConfigFilePath = path.join(this.serverDirPath, configFileName);
        //this.serverTemplateDirPath = path.join(this.serverDirPath, templateDirName);
        //this.packageFilePath = path.join(this.serverDirPath, npmPackageFileName);
        //this.storageDirPath = path.join(this.serverDirPath, storageDirName);
        //this.previewTemplateDirPath = path.join(this.serverTemplateDirPath, previewTemplateDirName);

        this.fileManager = new FileManager();
        this.compiler = new ProjectCompiler();

    }

    //setProjectDirPath(projectDirPath) {
    //    this.projectDirPath = projectDirPath;
    //    this.builderDirPath = path.join(projectDirPath, builderDirName);
    //    this.buildDirPath = path.join(this.builderDirPath, buildDirName);
    //    this.generatorsDirPath = path.join(this.builderDirPath, generatorsDirName);
    //    this.sourceDirPath = path.join(this.builderDirPath, sourceDirName);
    //    this.indexFilePath = path.join(this.sourceDirPath, indexFileName);
    //    this.docsDirPath = path.join(this.builderDirPath, docsDirName);
    //    this.projectTemplateDirPath = path.join(this.builderDirPath, templateDirName);
    //    this.projectPreviewTemplateDirPath = path.join(this.projectTemplateDirPath, previewTemplateDirName);
    //    this.scriptsDirName = scriptsDirName;
    //    this.configFilePath = path.join(this.builderDirPath, fileConfigName);
    //}

    doGeneration(projectModel){

        var outputDirPath = this.sm.getProject('livePreviewBuild.dirPath');


        let projectHtmlTemplateFilePath = path.join(this.sm.getProject('livePreviewTemplates.dirPath'), 'Html.tpl');
        let htmlTemplateFilePath = path.join(this.sm.getServer('livePreviewTemplates.dirPath'), 'Html.tpl');
        let htmlTemplate = null;

        let sequence = Promise.resolve();

        sequence = sequence.then(() => {
            return this.fileManager.removeFile(outputDirPath);
        });

        sequence = sequence.then(() => {
            return this.fileManager.readFile(projectHtmlTemplateFilePath)
                .then(fileData => {
                    htmlTemplate = _.template(fileData);
                })
                .catch( () => {
                    return this.fileManager.readFile(htmlTemplateFilePath)
                        .then(fileData => {
                            htmlTemplate = _.template(fileData);
                        });
                });
        });

        sequence = sequence.then( () => {
            var outputFilePath = path.join(outputDirPath,  'model.json');
            return this.fileManager.ensureFilePath(outputFilePath)
                .then(() => {
                    return this.fileManager.writeJson(
                        outputFilePath,
                        projectModel
                    );
                });
        });

        if(projectModel && projectModel.pages && projectModel.pages.length > 0){
            projectModel.pages.map( (page, index) => {

                var outputFilePath = path.join(outputDirPath, page.pageName + '.html');
                sequence = sequence.then( () => {
                    return this.fileManager.ensureFilePath(outputFilePath)
                        .then(() => {
                            return this.fileManager.writeFile(
                                outputFilePath,
                                htmlTemplate(page),
                                false
                            );
                        });
                });
            });
        } else {
            throw Error('Project does not have pages.');
        }

        return sequence;

    }

}

export default LivePreviewManager;