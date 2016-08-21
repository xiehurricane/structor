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
import esprima from 'esprima';
import escodegen from 'escodegen';
import * as fileManager from './fileManager.js';
import * as fileParser from './fileParser.js';
import * as config from './configuration.js';

export function findExportsNode(ast) {
    let exports = null;
    fileParser.traverse(ast, node => {
        if(node.type === 'ExportDefaultDeclaration'){
            exports = node.declaration;
        }
    });
    return exports;
}

export function findImports(ast){
    let imports = {};
    fileParser.traverse(ast, node => {
        if(node.type === 'ImportDeclaration'){
            const {specifiers, source} = node;
            if(specifiers && specifiers.length > 0 && source){
                specifiers.forEach(specifier => {
                    const {type, local} = specifier;
                    const {value} = source;
                    if((type === 'ImportDefaultSpecifier')
                        && local
                        && local.type === 'Identifier'
                        && value){
                        imports[local.name] = { source: value };
                    } else if((type === 'ImportSpecifier')
                        && local
                        && local.type === 'Identifier'
                        && value){
                        imports[local.name] = { source: value, member: true };
                    }
                });
            }
        }
    });
    return imports;
}

function appendToNode(node, variableString) {
    var newAst = esprima.parse('var c = {' + variableString + '}');
    var newPart = null;
    fileParser.traverse(newAst, node => {
        if (node.type === 'VariableDeclarator' && node.id.name === 'c') {
            newPart = node.init.properties[0];
        }
    });
    if (node.properties) {
        let index = -1;
        if (node.properties.length > 0) {
            index = _.findIndex(node.properties, (o) => {
                return (o.key && o.key.type === 'Identifier' && o.key.name === newPart.key.name);
            });
        }
        if (index >= 0) {
            node.properties[index] = newPart;
        } else {
            node.properties.push(
                newPart
            );
        }
    }
}

function memberExpressionToString(node, result) {
    let resultString = result || '';
    if (node.type === 'MemberExpression') {
        resultString += memberExpressionToString(node.object, resultString);
        if (resultString && resultString.length > 0) {
            resultString += '.' + node.property.name;
        } else {
            resultString = node.property.name;
        }
    }
    return resultString;
}


function parseIndexFile() {
    return fileManager.readFile(config.deskIndexFilePath())
        .then(data => {
            if (!data) {
                throw Error('Index file is empty.');
            }
            try {
                return fileParser.getFileAst(data);
            } catch (e) {
                throw Error(e.message + '. File path: ' + config.deskIndexFilePath());
            }
        });
}

export function getStructure(ast) {

    let structure = {
        imports: findImports(ast),
        groups: {}
    };

    let exportsNode = findExportsNode(ast);
    if (exportsNode) {
        let properties = exportsNode.properties;
        if (properties && properties.length > 0) {
            properties.forEach(property => {
                let group = structure.groups[property.key.name] = {
                    components: []
                };
                let values = property.value.properties;
                if (values && values.length > 0) {
                    values.forEach(value => {
                        let component = {
                            name: value.key.name
                        };
                        let from = structure.imports[component.name];
                        if(from){
                            component.source = from.source;
                            component.member = from.member;
                        }
                        group.components.push(component);
                    });
                }
            });
        }
    }
    return structure;
}

function resolveAbsoluteSourcePath(indexObj) {
    // let groups = indexObj.groups;
    // if (groups) {
    //     _.forOwn(groups, (group, prop) => {
    //         if (group.components && group.components.length > 0) {
    //             group.components.forEach(component => {
    //                 if (component.source && component.source.indexOf('../../') === 0) {
    //                     component.absoluteSource =
    //                         path.resolve(path.dirname(config.deskIndexFilePath()), component.source).replace(/\\/g, '/');
    //                 }
    //             });
    //         }
    //     });
    // }
    return indexObj;
}

function getComponentsNamesFromTree(componentsTree) {
    let componentsNames = [];
    _.forOwn(componentsTree, (group, groupName) => {
        _.forOwn(group, (component, componentName) => {
            componentsNames.push(componentName);
        });
    });
    return componentsNames;
}

export function initIndex() {
    return parseIndexFile()
        .then((ast) => {
            let indexObject = getStructure(ast);
            indexObject = resolveAbsoluteSourcePath(indexObject);
            return indexObject;
        });
}

export function getComponentsTree() {
    return initIndex()
        .then(indexObj => {
            let result = {};
            if (indexObj && indexObj.groups) {
                _.forOwn(indexObj.groups, (group, prop) => {
                    result[prop] = {};
                    if (group.components && group.components.length > 0) {
                        group.components.forEach(component => {
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

export function getComponentsNames() {
    return getComponentsTree()
        .then(componentsTree => {
            return getComponentsNamesFromTree(componentsTree);
        });
}

export function addComponent(groupName, componentName, source) {

    return parseIndexFile()
        .then(ast => {

            let exportsNode = findExportsNode(ast);
            if (exportsNode) {
                let groupNode = null;

                fileParser.traverse(exportsNode, node => {

                    if (node.type === 'Property' && node.key.type === 'Identifier') {
                        if (node.value.type === 'ObjectExpression' && node.key.name === groupName) {
                            groupNode = node.value;
                        }

                    }
                });

                if (!groupNode) {
                    appendToNode(exportsNode, groupName + ': {' + componentName + ': require("' + source + '")}');
                } else {
                    appendToNode(groupNode, componentName + ': require("' + source + '")');
                }
            }

            return escodegen.generate(ast);

        }).then(fileData => {
            return fileManager.writeFile(config.deskIndexFilePath(), fileData, true);
        }).then(() => {
            return initIndex();
        });
}

