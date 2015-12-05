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
import esprima from 'esprima-fb';
import escodegen from 'escodegen';
import FileManager from './FileManager.js';
import * as fileParser from './FileParser.js';

const group_keyword = '@Group:';
const resource_keyword = '@Resources';

function findExportsNode(ast){
    var exports = null;
    fileParser.traverse(ast, node => {
        if (node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression') {
            if (node.expression.left.type === 'Identifier' && node.expression.left.name === 'exports') {
                exports = node.expression.right;
            } else if(node.expression.left.type === 'MemberExpression' && node.expression.left.property.name === 'exports'){
                exports = node.expression.right;
            }
        }
    });

    var variableName = null;
    if(exports.type === 'Identifier'){
        variableName = exports.name;
        fileParser.traverse(ast, function(node){
            if(node.type === 'VariableDeclarator' && node.id.name === variableName){
                exports = node.init;
            }
        });
    }
    return exports;
}

function appendToNode(node, variableString){
    var newAst = esprima.parse('var c = {' + variableString + '}');
    var newPart = null;
    fileParser.traverse(newAst, node => {
        if(node.type === 'VariableDeclarator' && node.id.name === 'c'){
            newPart = node.init.properties[0];
        }
    });
    if(node.properties){
        node.properties.push(
            newPart
        );
    }
}

function memberExpressionToString(node, result){
    let resultString = result || '';
    if(node.type === 'MemberExpression') {
        resultString += memberExpressionToString(node.object, resultString);
        if(resultString && resultString.length > 0){
            resultString += '.' + node.property.name;
        } else {
            resultString = node.property.name;
        }
    }
    return resultString;
}


class IndexManager {

    constructor(sm){

        this.sm = sm;
        //this.indexFilePath = path.join(projectDirPath, builderDirName, sourceDirName, indexFileName);
        this.fileManager = new FileManager();
    }

    parseIndexFile(){
        return this.fileManager.readFile(this.sm.getProject('index.filePath'))
            .then( data => {
                if(!data){
                    throw Error('Index file is empty.');
                }
                try{
                    return fileParser.getFileAst(data);
                } catch(e){
                    throw Error(e.message + '. File path: ' + this.sm.getProject('index.filePath'));
                }
            });
    }

    getStructure(ast){

        let structure = {
            requires: [],
            groups: {}
        };

        fileParser.traverse(ast, node => {
            if(node.type === 'ExpressionStatement'
                && node.expression
                && node.expression.type === 'CallExpression'
                && node.expression.callee
                && node.expression.callee.name === 'require'){

                structure.requires.push({
                    source: node.expression.arguments[0].value
                });

            }
        });

        let exportsNode = findExportsNode(ast);
        if(exportsNode){
            let properties = exportsNode.properties;
            if(properties && properties.length > 0){
                properties.forEach( property => {
                    let group = structure.groups[property.key.name] = {
                        components: []
                    };

                    let values = property.value.properties;
                    if(values && values.length > 0){
                        values.forEach( value => {
                            let component = {
                                name: value.key.name
                            };
                            fileParser.traverse(value, node => {
                                if(node.type === 'CallExpression' && node.callee && node.callee.name === 'require'){
                                    if(node.arguments && node.arguments.length > 0){
                                        component.source = node.arguments[0].value;
                                    }
                                }
                            });
                            if(value.value.type === 'MemberExpression'){
                                component.member = memberExpressionToString(value.value);
                            }
                            group.components.push(component);
                        });
                    }
                });
            }
        }

        return structure;
    }

    resolveAbsoluteSourcePath(indexObj){
        var requires = indexObj.requires;
        if(requires && requires.length > 0){
            _.forEach(requires, item => {
                if( item.source && item.source.indexOf('../../') === 0){
                    item.absoluteSource =
                        path.resolve(path.dirname(this.sm.getProject('index.filePath')), item.source);
                }
            });
        }
        var groups = indexObj.groups;
        if(groups){
            _.forOwn(groups, (group, prop) => {
                if(group.components && group.components.length > 0){
                    group.components.forEach( component => {
                        if(component.source && component.source.indexOf('../../') === 0){
                            component.absoluteSource =
                                path.resolve(path.dirname(this.sm.getProject('index.filePath')), component.source);
                        }
                    });
                }
            });
        }
        return indexObj;
    }

    initIndex(){
        return this.parseIndexFile()
            .then((ast) => {
                let indexObject = this.getStructure(ast);
                indexObject = this.resolveAbsoluteSourcePath(indexObject);
                return indexObject;
            });
    }

    getComponentsTree(){
        return this.initIndex()
            .then( indexObj => {
                let result = {};
                if(indexObj && indexObj.groups){
                    _.forOwn(indexObj.groups, (group, prop) => {
                        result[prop] = {};
                        if(group.components && group.components.length > 0){
                            group.components.forEach( component => {
                                result[prop][component.name] = {
                                    name: component.name,
                                    absoluteSource: component.absoluteSource
                                };
                            });
                        }
                    });
                }
                return result;
            });
    }

    getComponentsNames(){
        return this.getComponentsTree()
            .then( componentsTree => {
                return this.getComponentsNamesFromTree(componentsTree);
            });
    }

    getComponentsNamesFromTree(componentsTree){
        let componentsNames = [];
        _.forOwn(componentsTree, (group, groupName) => {
            _.forOwn(group, (component, componentName) => {
                componentsNames.push(componentName);
            });
        });
        return componentsNames;
    }

    addComponent(groupName, componentName, source){

        return this.parseIndexFile()
            .then( ast => {

                let exportsNode = findExportsNode(ast);
                if(exportsNode){
                    let groupNode = null;

                    fileParser.traverse(exportsNode, node => {

                        if(node.type === 'Property' && node.key.type === 'Identifier'){
                            if(node.value.type === 'ObjectExpression' && node.key.name === groupName){
                                groupNode = node.value;
                            }

                        }
                    });

                    if(!groupNode){
                        appendToNode(exportsNode, groupName + ': {' + componentName + ': require("' + source + '")}');
                    } else {
                        appendToNode(groupNode, componentName + ': require("' + source + '")');
                    }
                }

                return escodegen.generate(ast);

            }).then( fileData => {
                return this.fileManager.writeFile(this.sm.getProject('index.filePath'), fileData, true);
            }).then( () => {
                return this.initIndex();
            });
    }


}

export default IndexManager;