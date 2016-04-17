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

require('babel-register');
var restApi = require('../../../src/application/api/app/restApi.js');
var fileManager = require('../../../src/server/commons/fileManager.js');
var url1 = 'http://localhost:2222/sandbox';
var method = 'sandboxPrepare';
var authMethod = 'initUserCredentials';
var model = {
    type: 'h3',
    props: {
        className: 'text-center'
    },
    children: [
        {
            type: 'span',
            text: 'Hello World!!!'
        }
    ]
};
var metadata = {};
restApi.makeRequest('http://localhost:2222/invoke', authMethod, {username: 'apustovalov@gmail.com', password: 'dadada'})
    .then(userAccount => {
        console.log(JSON.stringify(userAccount));
        return restApi.makeRequest(url1, 'sandboxPublish', {sampleId: 17, generatorKey: 'Scaffold.Views.TestView'})
            .then(response => {
                const responseText = JSON.stringify(response, null, 4);
                console.log(`From ${url1}: ${responseText}`);
            })
            .catch(e => {
                console.error(e);
            })
    })
    .catch(e => {
        console.error(e);
    });
