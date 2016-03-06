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
        return this.client.post(this.sm.getIn('client.serviceURL') +
            '/sm/gengine/preprocess?generatorKey=' + options.generatorKey + '&projectId=' + options.projectId,
            options.data);
    }

    invokeGenerationOnline(options){
        return this.client.post(this.sm.getIn('client.serviceURL') +
            '/sm/gengine/process?generatorKey=' + options.generatorKey + '&projectId=' + options.projectId,
            options.data);
    }

    initUserCredentialsByToken(options){
        this.client.setAuthenticationToken(options.token);
        return this.client.get(this.sm.getIn('client.serviceURL') + '/sm/user/profile-full')
            .then(userAccount => {
                return Object.assign({}, userAccount, {token: options.token});
            })
            .catch(err => {
                console.log('Authentication token is invalid or was expired');
                return {};
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

    downloadGeneratorFile(generatorKey, version){

        return this.fileManager.readJson(this.sm.getProject('config.filePath'))
            .then(projectConfig => {
                if(projectConfig.projectName){
                    let downloadUrl = this.sm.getIn('client.serviceURL') + '/genclient/' +
                        projectConfig.projectName + '/' + generatorKey.replace(/\./g,'/') + '/' + version + '/client.tar.gz';
                    return this.client.downloadGet(downloadUrl);
                }
                throw Error('Current project\'s configuration does not have projectName field. It seems project is not compatible with Structor\'s version.');
            });
    }

    getGeneratorBriefText(generatorKey){
        return this.fileManager.readJson(this.sm.getProject('config.filePath'))
            .then(projectConfig => {
                if(projectConfig.projectName){
                    return this.client.getText(this.sm.getIn('client.serviceURL') + '/genclient/' +
                        projectConfig.projectName + '/' + generatorKey.replace(/\./g,'/') + '/brief.md');
                }
                throw Error('Current project\'s configuration does not have projectName field. It seems project is not compatible with Structor\'s version.');
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
                throw Error('Current project\'s configuration does not have projectId field. It seems project is not compatible with Structor\'s version.');
            });
    }

}

export default ClientManager;
