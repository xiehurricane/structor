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
import { makeRequest } from './restApi.js';
import HtmlComponents, {getSortedHtmlComponents} from '../utils/HtmlComponents.js';

export function getProjectInfo(){
    let result = {};
    return makeRequest('getPackageConfig')
        .then(packageConfig => {
            result.packageConfig = packageConfig;
            return makeRequest('checkProjectDir');
        })
        .then(projectDirectoryStatus => {
            result.projectDirectoryStatus = projectDirectoryStatus;
            if(projectDirectoryStatus === 'ready-to-go'){
                return makeRequest('openLocalProject')
                    .then(projectData => {
                        result.projectData = projectData;
                        return result;
                    });
            }
            return result;
        })
}

export function initUserCredentialsByToken(token){
    return makeRequest('initUserCredentialsByToken', {token: token});
}

export function initUserCredentials(email, password){
    return makeRequest('initUserCredentials', { username: email, password: password });
}

export function saveProjectModel(model){
    return makeRequest('saveProjectModel', { model: model });
}

export function loadComponentsTree(){
    let result = {};
    return makeRequest('getComponentsTree', {})
        .then(response => {
            if(response){
                const {componentsTree} = response;
                if(componentsTree){
                    componentsTree['Html'] = getSortedHtmlComponents();
                    let componentDefaultsMap = new Map();
                    let sequence = Promise.resolve();
                    forOwn(componentsTree, (group, groupName) => {
                        if(isObject(group)){
                            forOwn(group, (componentTypeValue, componentName) => {
                                sequence = sequence.then(() => {
                                    return makeRequest('loadComponentDefaults', {componentName})
                                        .then(response => {
                                            if(!response || response.length <= 0){
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
            }
            return Promise.resolve(result);
        });
}

export function loadComponentOptions(componentName, sourceCodeFilePath){
    let result = {};
    return makeRequest('readComponentDocument', {componentName})
        .then(response => {
            console.log('loadComponentOptions Response: ' + JSON.stringify(response));
            result.readmeText = response;
            if(sourceCodeFilePath){
                return makeRequest('readComponentCode', {filePath: sourceCodeFilePath})
                    .then(response => {
                        result.sourceCode = response;
                        return result;
                    });
            } else {
                return result;
            }
        });
}

export function writeComponentSource(sourceCodeFilePath, sourceCode){
    return makeRequest('rewriteComponentCode', {filePath: sourceCodeFilePath, sourceCode});
}