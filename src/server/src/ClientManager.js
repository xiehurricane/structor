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
