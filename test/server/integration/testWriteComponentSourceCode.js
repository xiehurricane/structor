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
var method = 'writeComponentSourceCode';
var sourceCode = "import React, { Component, PropTypes } from 'react';\nimport { Calendar } from 'react-widgets';\n\n//Injected comment\n\nclass CalendarWrapper extends Component {\n\n    constructor(props, content) {\n        super(props, content);\n    }\n\n    render() {\n        return (<Calendar defaultValue={new Date()} {...this.props} />\n            );\n    }\n}\n\nexport default CalendarWrapper;\n";
var taskList = [
    restApi.makeRequest(url1, method, {
        filePath: '/Volumes/Development/projects/structor/structor-github-boilerplates/bootstrap-prepack/src/client/components/Widgets/CalendarWrapper.jsx',
        sourceCode: sourceCode
    })
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
