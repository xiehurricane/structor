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
import Client from './Client.js';
import FileManager from './FileManager.js';

class ClientManager {

    constructor(sm){
        this.sm = sm;
        this.client = new Client(this.sm);
        this.fileManager = new FileManager();
    }

    getAllProjects(options){
        return this.client.get(this.sm.getIn('client.serviceURL') + '/sm/public/gallery/list');
    }

    invokePreGenerationOnline(options){
        return this.client.post(this.sm.getIn('client.serviceURL') + '/sm/gengine/preprocess', options.data);
    }

    invokeGenerationOnline(options){
        return this.client.post(this.sm.getIn('client.serviceURL') + '/sm/gengine/process', options.data);
    }

    initUserCredentialsByToken(options){
        this.client.setAuthenticationToken(options.token);
        return this.client.get(this.sm.getIn('client.serviceURL') + '/sm/user/profile-full')
            .then(userAccount => {
                return Object.assign({}, userAccount, {token: options.token});
            })
            .catch(err => {
                console.log('Authentication token is invalid or was expired');
            });
    }

    initUserCredentials(options){
        return this.client.post(this.sm.getIn('client.serviceURL') + '/sm/auth',
            { username: options.username, password: options.password })
            .then(response => {
                return this.initUserCredentialsByToken(response);
            })
            .catch(error => {
                throw Error('Account credentials are not valid.');
            });
    }

    removeAuthToken(){
        this.client.setAuthenticationToken(null);
        return Promise.resolve();
    }

    downloadGalleryFile(downloadUrl){
        return this.client.downloadGet(downloadUrl);
    }

    getGeneratorBriefText(generatorKey){
        return this.fileManager.readJson(this.sm.getProject('config.filePath'))
            .then(projectConfig => {
                return this.client.getText(this.sm.getIn('client.serviceURL') + '/genclient/' +
                    projectConfig.projectName + '/' + generatorKey.replace(/\./g,'/') + '/brief.md');
            })
            .then(text => {
                return {
                    briefText: text
                }
            });
    }

    getAvailableGeneratorList(){
        return this.fileManager.readJson(this.sm.getProject('config.filePath'))
            .then(projectConfig => {
                if(projectConfig.projectId){
                    return this.client.get(this.sm.getIn('client.serviceURL') + '/sm/public/generator/map?projectId=' + projectConfig.projectId);
                }
            });
    }

}

export default ClientManager;
