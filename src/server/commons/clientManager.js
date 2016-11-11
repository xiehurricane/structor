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

// import _ from 'lodash';
import path from 'path';
import * as client from './client.js';
import * as config from './configuration.js';
import {SERVICE_URL} from './configuration.js';

export function getAllProjects() {
    return client.get(SERVICE_URL + '/sm/public/gallery/list');
}

export function invokePreGeneration(generatorId, version, data) {
    return client.post(SERVICE_URL + '/sm/gengine/preprocess?generatorId=' + generatorId + '&version=' + version, data);
}

export function invokeGeneration(generatorId, version, data) {
    return client.post(SERVICE_URL + '/sm/gengine/process?generatorId=' + generatorId + '&version=' + version, data);
}

export function initUserCredentialsByToken(token) {
    client.setAuthenticationToken(token);
    // console.log('Set token: ', token);
    return {data:{}};
    // return client.get(SERVICE_URL + '/sm/user/profile-full')
    //     .then(userAccount => {
    //         // console.log('User profile full: ', JSON.stringify(userAccount));
    //         return Object.assign({}, userAccount, {token});
    //     })
    //     .catch(err => {
    //         console.error(err);
    //         console.log('Authentication token is invalid or was expired');
    //         return {};
    //     });
}

export function initUserCredentials(username, password) {
    return client.post(SERVICE_URL + '/sm/auth', {username, password})
        .then(response => {
            if(response.token){
                return initUserCredentialsByToken(response.token);
            }
            throw Error('Token is missing in response.');
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

export function downloadGeneratorScreenshot(userId, generatorId){
    return client.downloadGet(SERVICE_URL + '/sm/public/generator/info/' + userId + '/' + generatorId + '/screenshot.png');
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

export function getGeneratorReadmeText(userId, generatorId) {
        return client.getText(SERVICE_URL + '/sm/public/generator/info/' + userId + '/' + generatorId + '/readme.md')
}

export function getAvailableGeneratorsList() {
    if (config.projectId()) {
        return client.get(SERVICE_URL + '/sm/public/generator/map?projectId=' + config.projectId());
    }
    return Promise.reject('Current project\'s configuration does not have projectId field. It seems project is not compatible with Structor\'s version.');
}

export function getAvailableGeneratorGenerics(){
    if (config.projectId()) {
        return client.get(SERVICE_URL + '/sm/public/generator/generics?projectId=' + config.projectId());
    }
    return Promise.reject('Current project\'s configuration does not have projectId field. It seems project is not compatible with Structor\'s version.');
}

export function publishFiles(generatorKey, data){
    if (config.projectId()) {
        return client.post(SERVICE_URL + '/sm/gengine/publish?generatorKey=' + generatorKey + "&projectId=" + config.projectId(), data)
            .then(generatorObject => {
                if(generatorObject.generatorId !== '-1'){
                    const screenshotPath = path.join(config.sandboxDirPath(), 'screenshot.png').replace(/\\/g, '/');
                    return client.uploadFile(SERVICE_URL + '/sm/gengine/uploadScreenshot?generatorId=' + generatorObject.generatorId, screenshotPath, 'screenshot')
                        .then(() => {
                            return generatorObject;
                        });
                } else {
                    throw Error('Server could not save generator: ', generatorKey);
                }
            });
    }
    return Promise.reject('Current project\'s configuration does not have projectId field. It seems project is not compatible with Structor\'s version.');
}

export function removeGenerator(generatorId){
    if (config.projectId()) {
        return client.post(SERVICE_URL + '/sm/gengine/removeGenerator?generatorId=' + generatorId, {});
    }
    return Promise.reject('Current project\'s configuration does not have projectId field. It seems project is not compatible with Structor\'s version.');
}

// export function sandboxPrepare(generatorId, version){
//     return client.post(SERVICE_URL + '/sm/gengine/sandbox/prepare?generatorId=' + generatorId + '&version=' + version, {});
// }
//
// export function sandboxReadFiles(sampleId){
//     return client.post(SERVICE_URL + '/sm/gengine/sandbox/read?sampleId=' + sampleId, {});
// }
//
// export function sandboxWriteFiles(sampleId, filesObject){
//     return client.post(SERVICE_URL + '/sm/gengine/sandbox/write?sampleId=' + sampleId, filesObject);
// }
//
// export function sandboxProcess(sampleId, data){
//     return client.post(SERVICE_URL + '/sm/gengine/sandbox/process?sampleId=' + sampleId, data);
// }
//
// export function sandboxPublish(sampleId, generatorKey, forceClone){
//     const screenshotPath = path.join(config.sandboxDirPath(), 'work', '.structor', 'desk', 'assets', 'img', 'screenshot.png').replace(/\\/g, '/');
//     let publishUrl = SERVICE_URL + '/sm/gengine/sandbox/publish?sampleId=' + sampleId + '&generatorKey=' + generatorKey + '&projectId=' + config.projectId();
//     if(forceClone === true){
//         publishUrl += '&forceClone=true';
//     }
//     return client.uploadFile(publishUrl, screenshotPath, 'screenshot');
// }
