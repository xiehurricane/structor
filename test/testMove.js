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
var fs = require('fs-extra');
var model = require('./model_single_page.js');
var graphApi = require('../src/application/api/model/graphApi.js');
var utils = require('../src/application/api/utils/utils.js');

function writeJson(filePath, jsonObj){
    return new Promise( function(resolve, reject){
        fs.writeJson(filePath, jsonObj, function(err) {
            if(err){
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

graphApi.initGraph(model);

var tree = graphApi.traverseAllGraph();
console.log(JSON.stringify(tree, null, 4));

//var graph = graphApi.getGraph();
var toCutKeys = ['9', '7', '8'];
toCutKeys.forEach(function(key){
    var node = graphApi.getNode(key);
    if(node){
        node.selected = true;
    }
});


var detachedKeys = graphApi.moveSelected();

tree = graphApi.traverseAllGraph();
console.log(JSON.stringify(tree, null, 4));

console.log('Detached keys: ' + JSON.stringify(detachedKeys, null, 4));

writeJson('moveSelectedModel.json', utils.fulex(graphApi.getModel()))
    .then(function(){
        console.log('Model is written down');
    })
    .catch(function(err){
        console.error(err);
    });
