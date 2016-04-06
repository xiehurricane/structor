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
var url1 = 'http://localhost:2222/invoke';
var method = 'getModel';
var taskList = [
    restApi.makeRequest(url1, method, {message: 'Hello!!!'})
        .then(response => {
            const responseText = JSON.stringify(response, null, 4);
            console.log(`From ${url1}: ${responseText}`);
        })
        .catch(e => {
            console.error(e);
        })
];

Promise.all(taskList)
    .then(() => {
        console.log('Done.');
    });
