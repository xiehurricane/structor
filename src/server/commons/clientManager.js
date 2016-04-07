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
import * as client from './client.js';
import * as config from './configuration.js';
import {SERVICE_URL} from './configuration.js';

export function getAllProjects() {
    return client.get(SERVICE_URL + '/sm/public/gallery/list');
}

export function invokePreGenerationOnline(options) {
    return this.client.post(SERVICE_URL +
        '/sm/gengine/preprocess?generatorKey=' + options.generatorKey + '&projectId=' + options.projectId,
        options.data);
}

export function invokeGenerationOnline(options) {
    return client.post(SERVICE_URL +
        '/sm/gengine/process?generatorKey=' + options.generatorKey + '&projectId=' + options.projectId,
        options.data);
}

export function initUserCredentialsByToken(token) {
    client.setAuthenticationToken(token);
    return client.get(SERVICE_URL + '/sm/user/profile-full')
        .then(userAccount => {
            return Object.assign({}, userAccount, {token});
        })
        .catch(err => {
            console.log('Authentication token is invalid or was expired');
            return {};
        });
}

export function initUserCredentials(username, password) {
    return client.post(SERVICE_URL + '/sm/auth', {username, password})
        .then(response => {
            return initUserCredentialsByToken(response);
        })
        .catch(error => {
            throw Error('Account credentials are not valid.');
        });
}

export function removeAuthToken() {
    client.setAuthenticationToken(null);
    return Promise.resolve();
}

export function downloadGalleryFile(downloadUrl) {
    return client.downloadGet(downloadUrl);
}

//export function downloadGeneratorFile(generatorKey, version) {
//    const projectConfig = require(this.sm.getProject('config.filePath'));
//    if (projectConfig.projectName) {
//        let downloadUrl = this.sm.getIn('client.serviceURL') + '/genclient/' +
//            projectConfig.projectName + '/' + generatorKey.replace(/\./g, '/') + '/' + version + '/client.tar.gz';
//        return this.client.downloadGet(downloadUrl);
//    }
//    throw Error('Current project\'s configuration does not have projectName field. It seems project is not compatible with Structor\'s version.');
//}

export function getGeneratorBriefText(generatorKey) {
    if (config.projectName()) {
        return client.getText(SERVICE_URL + '/genclient/' +
            config.projectName() + '/' + generatorKey.replace(/\./g, '/') + '/brief.md')
            .then(text => {
                return {
                    briefText: text
                }
            });

    }
    throw Error('Current project\'s configuration does not have projectName field. It seems project is not compatible with Structor\'s version.');
}

export function getAvailableGeneratorList() {
    if (config.projectId()) {
        return client.get(SERVICE_URL + '/sm/public/generator/map?projectId=' + config.projectId());
    }
    throw Error('Current project\'s configuration does not have projectId field. It seems project is not compatible with Structor\'s version.');
}
