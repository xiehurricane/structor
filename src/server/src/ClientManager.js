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

    initUserCredentials(options){
        return this.client.setupUserCredentials(options).then(() => { return 'OK'});
    }

    removeUserCredentials(options){
        return this.client.removeUserCredentials().then(() => { return 'OK'});
    }

    getAllProjects(options){
        return this.client.post(this.sm.getIn('client.serviceURL') + '/structor/invoke', { methodName: 'getProjectGallery' });
    }

    loadUserProfile(){
        var userProfile = {
            login: this.sm.getIn('client.user')
        };
        return this.client.post(this.sm.getIn('client.serviceURL') + "/api/structor/secure/getUserProfile", userProfile, true)
            .then( () => {
                return { userName: this.sm.getIn('client.user') };
            });
    }

    createUserProfile(options){
        var userProfile = {
            login: options.user,
            pwd: options.pass,
            email: options.email
        };
        return this.client.post(this.sm.getIn('client.serviceURL') + "/api/structor/addUser", userProfile);
    }

    downloadGalleryFile(downloadUrl){
        return this.client.downloadGet(downloadUrl);
    }

    //createProject(options){
    //    return this.client.post('/secure/createProject', options, true);
    //}
    //
    //checkCreateProject(options){
    //    return this.client.post('/secure/checkCreateProject', options, true);
    //}
    //
    //uploadProjectFiles(options){
    //    var uploadConfig = {
    //        url: '/secure/uploadProject/' + options.projectId,
    //        filePaths: options.filePaths
    //    };
    //    return this.client.upload(uploadConfig, true);
    //}

}

export default ClientManager;
