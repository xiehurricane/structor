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
var _ = require('lodash');
var npmUtils = require('../../src/server/commons/npmUtils.js');
var workingDir = '/Volumes/Development/projects/structor/structor-github-boilerplates/bootstrap-prepack';

npmUtils.getPackageAbsolutePath('lodash', workingDir)
    .then(result => {
        console.log(_.isBoolean(result));
        console.log(_.isString(result));
        console.log(result);

        //return npmUtils.getPackageAbsolutePath('lodash', workingDir)
        //    .then(result => {
        //        console.log(result);
        //    });

    })
    .catch(err => {
        console.error(err);
    });
