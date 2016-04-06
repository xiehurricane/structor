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
var graphlib = require('graphlib');
var model = require('./model.js');
var graphApi = require('../src/application/api/model/graphApi.js');

var graph = graphApi.initGraph(model);
//console.log(JSON.stringify(model, null, 4));

var tree = graphApi.traverseGraph('/UnnamedPage4');

console.log(JSON.stringify(tree, null, 4));

//console.log('// Move 2,6 after 13 --- ');
//graphApi.moveAfterOrBeforeNode(['2', '6'], '13', true);

//var tree1 = graphApi.traverseGraph('/UnnamedPage4');
//console.log(JSON.stringify(tree1, null, 4));

//console.log('// Move 12 before 9 --- ');
//graphApi.moveAfterOrBeforeNode(['12'], '9', false);

//var tree2 = graphApi.traverseGraph('/UnnamedPage4');
//console.log(JSON.stringify(tree2, null, 4));

//console.log('// Copy 2,6 after 15 --- ');
//graphApi.copyAfterOrBeforeNode(['2', '6'], '15', true);
//
//var tree3 = graphApi.traverseGraph('/UnnamedPage4');
//console.log(JSON.stringify(tree3, null, 4));

//console.log('// Move 2,6 as first 11 --- ');
//graphApi.moveAsFirstOrLast(['2', '6'], '11', true);
//
//var tree4 = graphApi.traverseGraph('/UnnamedPage4');
//console.log(JSON.stringify(tree4, null, 4));

//console.log('// Move 2,6 as last 11 --- ');
//graphApi.moveAsFirstOrLast(['2', '6'], '11');
//
//var tree5 = graphApi.traverseGraph('/UnnamedPage4');
//console.log(JSON.stringify(tree5, null, 4));

//console.log('// Copy 2,6 as first 11 --- ');
//graphApi.copyAsFirstOrLast(['2', '6'], '11', true);
//
//var tree6 = graphApi.traverseGraph('/UnnamedPage4');
//console.log(JSON.stringify(tree6, null, 4));

console.log('// Copy 70,72 as last 11 --- ');
graphApi.copyAsFirstOrLast(['70', '72'], '9');

var tree7 = graphApi.traverseGraph('/UnnamedPage4');
console.log(JSON.stringify(tree7, null, 4));

//console.log('\n\n ------- \n\n');
//console.log(JSON.stringify(model, null, 4));