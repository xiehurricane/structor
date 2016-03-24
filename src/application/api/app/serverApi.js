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

import { makeRequest } from './restApi.js';

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