import fs from 'fs-extra';
import request from 'request';
import FileManager from './FileManager.js';

class Client {

    constructor (sm) {
        this.sm = sm;
        this.fileManager = new FileManager();
    }

    setupUserCredentials(options){
        return new Promise( (resolve, reject) => {
            this.sm.setIn('client.user', options.user);
            this.sm.setIn('client.pass', options.pass);
            resolve();
        });
    }

    removeUserCredentials(){
        return new Promise( (resolve, reject) => {
            this.sm.setIn('client.user', null);
            this.sm.setIn('client.pass', null);
            resolve();
        });
    }

    getUser(){
        return this.configModel.user;
    }

    post (methodName, body, isAuth = false) {
        return new Promise( (resolve, reject) => {
            const url = this.sm.getIn('client.serviceURL') + '/' + methodName;
            var requestOptions = {
                uri: url,
                method: 'POST',
                json: true,
                body: body
            };
            if (isAuth) {
                if (this.sm.getIn('client.user') && this.sm.getIn('client.pass')) {
                    requestOptions.auth = {
                        'user': this.sm.getIn('client.user'),
                        'pass': this.sm.getIn('client.pass'),
                        'sendImmediately': true
                    }
                } else {
                    reject('Specify user name and password or create new account.');
                }
            }
            try {
                request(
                    requestOptions,
                    (error, response, body) => {
                        if (response) {
                            if (response.statusCode !== 200) {
                                if (response.statusCode === 401) {
                                    reject('User is not authenticated');
                                } else {
                                    reject('Got error code ' + response.statusCode + ' processing request to ' + url);
                                }
                            } else if (error) {
                                reject('Error connection to ' + this.sm.getIn('client.serviceURL'));
                            } else {
                                if (body.error === true) {
                                    let errorMessage = "Error: ";
                                    if(body.errors && body.errors.length > 0){
                                        body.errors.map( errorStr => {
                                            errorMessage += errorStr + ', ';
                                        });
                                    }
                                    reject(errorMessage.substr(0, errorMessage.length - 2));
                                } else {
                                    resolve(body.data);
                                }
                            }
                        } else {
                            reject('Error connection to ' + this.sm.getIn('client.serviceURL'));
                        }
                    }
                )
            } catch (e) {
                reject('Error: ' + e.message);
            }
        });
    }

    download(methodName, body, isAuth = false) {
        return new Promise( (resolve, reject) => {
            const requestBody = body;
            const url = this.sm.getIn('client.serviceURL') + methodName;
            let requestOptions = {
                uri: url,
                headers: {'Content-type': 'application/json'},
                method: 'POST',
                body: JSON.stringify(requestBody),
                encoding: null
            };
            if (isAuth) {
                if (this.sm.getIn('client.user') && this.sm.getIn('client.pass')) {
                    requestOptions.auth = {
                        'user': this.sm.getIn('client.user'),
                        'pass': this.sm.getIn('client.pass'),
                        'sendImmediately': true
                    }
                } else {
                    reject('Specify user name and password or create new account.');
                }
            }
            try {
                request(
                    requestOptions,
                    (error, response, body) => {
                        if (response) {
                            if (response.statusCode !== 200) {
                                if (response.statusCode === 401) {
                                    reject('User is not authenticated');
                                } else {
                                    reject('Got error code ' + response.statusCode + ' processing request to ' + url);
                                }
                            } else if (error) {
                                reject('Error connection to ' + this.sm.getIn('client.serviceURL'));
                            } else {
                                resolve(body);
                            }
                        } else {
                            reject('Error connection to ' + this.sm.getIn('client.serviceURL'));
                        }
                    }
                )
            } catch (e) {
                reject('Error: ' + e.message);
            }
        });

    }

    downloadGet(methodName, isAuth = false) {
        return new Promise( (resolve, reject) => {
            const url = this.sm.getIn('client.serviceURL') + methodName;
            let requestOptions = {
                uri: url,
                method: 'GET',
                encoding: null
            };
            if (isAuth) {
                if (this.sm.getIn('client.user') && this.sm.getIn('client.pass')) {
                    requestOptions.auth = {
                        'user': this.sm.getIn('client.user'),
                        'pass': this.sm.getIn('client.pass'),
                        'sendImmediately': true
                    }
                } else {
                    reject('Specify user name and password or create new account.');
                }
            }
            try {
                request(
                    requestOptions,
                    (error, response, body) => {
                        if (response) {
                            if (response.statusCode !== 200) {
                                if (response.statusCode === 401) {
                                    reject('User is not authenticated');
                                } else {
                                    reject('Got error code ' + response.statusCode + ' processing request to ' + url);
                                }
                            } else if (error) {
                                reject('Error connection to ' + this.sm.getIn('client.serviceURL'));
                            } else {
                                resolve(body);
                            }
                        } else {
                            reject('Error connection to ' + this.sm.getIn('client.serviceURL'));
                        }
                    }
                )
            } catch (e) {
                reject('Error: ' + e.message);
            }
        });

    }

    upload(option, isAuth = false) {
        return new Promise( (resolve, reject) => {
            const url = this.sm.getIn('client.serviceURL') + option.url;
            let requestOptions = {
                uri: url,
                method: 'POST'
            };
            if (isAuth) {
                if (this.sm.getIn('client.user') && this.sm.getIn('client.pass')) {
                    requestOptions.auth = {
                        'user': this.sm.getIn('client.user'),
                        'pass': this.sm.getIn('client.pass'),
                        'sendImmediately': true
                    }
                } else {
                    reject('Specify user name and password or create new account.');
                }
            }
            requestOptions.formData = {};
            if (option.filePaths && option.filePaths.length > 0) {
                option.filePaths.map( (filePath, index) => {
                    requestOptions.formData['file_' + index] = fs.createReadStream(filePath);
                });
            } else {
                reject('Files for uploading were not specified.');
            }
            try {
                request(
                    requestOptions,
                    (error, response, body) => {
                        if (response) {
                            if (response.statusCode !== 200) {
                                if (response.statusCode === 401) {
                                    reject('User is not authenticated');
                                } else {
                                    reject('Got error code ' + response.statusCode + ' processing request to ' + url);
                                }
                            } else if (error) {
                                reject('Error connection to ' + this.sm.getIn('client.serviceURL'));
                            } else if (body) {
                                if (body.error === true) {
                                    let errorMessage = "Error: ";
                                    if(body.errors && body.errors.length > 0){
                                        body.errors.map( errorStr => {
                                            errorMessage += errorStr + ', ';
                                        });
                                    }
                                    reject(errorMessage.substr(0, errorMessage.length - 2));
                                } else {
                                    resolve(body.data);
                                }
                            }
                        } else {
                            reject('Error connection to ' + this.sm.getIn('client.serviceURL'));
                        }
                    }
                )
            } catch (e) {
                reject('Error: ' + e.message);
            }
        });
    }

}

export default Client;
