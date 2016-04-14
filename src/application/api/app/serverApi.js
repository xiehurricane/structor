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

import {forOwn, isObject} from 'lodash';
import { invokeStructor, invokeSandbox } from './restApi.js';
import HtmlComponents, {getSortedHtmlComponents} from '../utils/HtmlComponents.js';

export function getProjectInfo() {
    return invokeStructor('getConfig')
        .then(config => {
            return {projectConfig: config, projectStatus: config.status};
        });
}

export function initUserCredentialsByToken(token) {
    return invokeStructor('initUserCredentialsByToken', {token: token});
}

export function initUserCredentials(email, password) {
    return invokeStructor('initUserCredentials', {username: email, password: password});
}

export function removeUserCredentials(){
    return invokeStructor('removeUserCredentials', {});
}

export function getProjectModel() {
    return invokeStructor('getModel');
}

export function saveProjectModel(model) {
    return invokeStructor('saveProjectModel', {model: model});
}

export function exportProjectModel(model){
    return invokeStructor('saveProjectModel', {model: model}).then(() => {
        return invokeStructor('exportPages', {model: model});
    });
}

export function loadComponentsTree() {
    let result = {};
    return invokeStructor('getComponentsTree', {})
        .then(response => {
            if (response) {
                let componentsTree = response;
                componentsTree['Html'] = getSortedHtmlComponents();
                let componentDefaultsMap = new Map();
                let sequence = Promise.resolve();
                forOwn(componentsTree, (group, groupName) => {
                    if (isObject(group)) {
                        forOwn(group, (componentTypeValue, componentName) => {
                            sequence = sequence
                                .then(() => {
                                    return invokeStructor('getComponentDefaults', {componentName})
                                        .then(response => {
                                            if (!response || response.length <= 0) {
                                                let htmlDefaults = HtmlComponents[componentName];
                                                response = [];
                                                if (htmlDefaults) {
                                                    response.push({
                                                        variantName: 'Unsaved variant',
                                                        type: componentName,
                                                        props: htmlDefaults.props,
                                                        children: htmlDefaults.children,
                                                        text: htmlDefaults.text
                                                    });
                                                } else {
                                                    response.push({
                                                        variantName: 'Unsaved variant',
                                                        type: componentName
                                                    });
                                                }
                                            }
                                            componentDefaultsMap.set(componentName, response);
                                        });
                                })
                                .catch(e => {
                                    console.error(e);
                                });
                        });
                    }
                });
                return sequence.then(() => {
                    result.componentDefaultsMap = componentDefaultsMap;
                    result.componentsTree = componentsTree;
                    return result;
                });
            }
            return Promise.resolve(result);
        });
}

export function loadComponentOptions(componentName, sourceCodeFilePath) {
    let result = {};
    return invokeStructor('getComponentNotes', {componentName})
        .then(response => {
            result.readmeText = response;
            if (sourceCodeFilePath) {
                return invokeStructor('getComponentSourceCode', {filePath: sourceCodeFilePath})
                    .then(response => {
                        result.sourceCode = response;
                        return result;
                    });
            } else {
                return result;
            }
        });
}

export function writeComponentSource(sourceCodeFilePath, sourceCode) {
    return invokeStructor('writeComponentSourceCode', {filePath: sourceCodeFilePath, sourceCode});
}

export function getAvailableGeneratorsList(){
    return invokeStructor('getAvailableGeneratorsList');
}

export function getGeneratorBriefInfo(projectId, userId, generatorId){
    return invokeStructor('getGeneratorBrief', {projectId, userId, generatorId});
}

export function pregenerate(generatorId, version, groupName, componentName, model){
    return invokeStructor('pregenerate', {generatorId, version, groupName, componentName, model});
}
export function generate(generatorId, version, groupName, componentName, model, metadata){
    return invokeStructor('generate', {generatorId, version, groupName, componentName, model, metadata});
}

export function saveGenerated(groupName, componentName, files, dependencies){
    return invokeStructor('saveGenerated', {groupName, componentName, files, dependencies});
}

export function getAvailableGeneratorSamplesList(){
    return invokeSandbox('getGeneratorSamples');
}

export function prepareGeneratorSampleSandbox(sampleId){
    return invokeSandbox('removeWorkingDirectory')
        .then(() => {
            return invokeSandbox('makeWorkingDirectory');
        })
        .then(() => {
            return invokeSandbox('sandboxPrepare', {sampleId});
        })
        .then(() => {
            return invokeSandbox('sandboxReadFiles', {sampleId});
        });
}