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
import FileManager from './FileManager.js';
import * as fileParser from './FileParser.js';

const group_keyword = '@Group:';
const resource_keyword = '@Resources';

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
        if(!ast.comments || ast.comments.length <= 0){
            throw Error('Index file does not have comments.');
        }

        let structure = {
            startBlockPosition: ast.range[0],
            endBlockPosition: ast.range[1],
            groups: {}
        };
        let comment = null;
        let prevCommentStartPosition = ast.range[1];
        for(let i = ast.comments.length - 1; i >= 0; --i){
            comment = ast.comments[i];
            if(comment.type === 'Line'){
                let wordPos = comment.value.indexOf(group_keyword);
                if(wordPos >= 0){
                    structure.groups[comment.value.substr(wordPos + group_keyword.length).trim()] = {
                        startBlockPosition: comment.range[1],
                        endBlockPosition: prevCommentStartPosition,
                        components: []
                    };
                    prevCommentStartPosition = comment.range[0];
                } else {
                    wordPos = comment.value.indexOf(resource_keyword);
                    if(wordPos >= 0){
                        structure.resources = {
                            startBlockPosition: comment.range[1],
                            endBlockPosition: prevCommentStartPosition,
                            items: []
                        };
                        prevCommentStartPosition = comment.range[0];
                    }
                }
            }
        }

        return structure;
    }

    fillGroups(ast, groups){

        fileParser.traverse(ast, node => {
            if(node.type === 'ExportDeclaration'){
                _.forOwn(groups, (value, prop) => {
                    if( node.range[0] > value.startBlockPosition && node.range[1] <= value.endBlockPosition ){
                        if(node.specifiers && node.specifiers.length > 0){
                            node.specifiers.map( (specifier, index) => {
                                if(specifier.type === 'ExportSpecifier' && specifier.id.type === 'Identifier'){
                                    groups[prop].components.push({
                                        name: specifier.id.name,
                                        source: node.source.value.trim(),
                                        startLinePosition: node.range[0],
                                        endLinePosition: node.range[1]
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });

        return groups;
    }

    fillResourceItems(ast, resources){
        resources.items = resources.items || [];
        fileParser.traverse(ast, node => {
            if(node.type === 'ImportDeclaration'){
                if( node.range[0] > resources.startBlockPosition && node.range[1] <= resources.endBlockPosition ) {
                    resources.items.push({
                        source: node.source.value,
                        startLinePosition: node.range[0],
                        endLinePosition: node.range[1]
                    });
                }
            }
        });
        return resources;
    }

    resolveAbsoluteSourcePath(groups){
        if(groups){
            _.forOwn(groups, (group, prop) => {
                if(group.components && group.components.length > 0){
                    group.components.map( component => {
                        if(component.source && component.source.indexOf('../../') === 0){
                            component.absoluteSource = path.resolve(this.sm.getProject('index.filePath'), component.source);
                        }
                    });
                }
            });
        }
        return groups;
    }

    initIndex(){
        return this.parseIndexFile()
            .then((ast) => {
                //console.log(JSON.stringify(ast, null, 4));
                let indexObject = this.getStructure(ast);
                if(indexObject.groups){
                    indexObject.groups = this.fillGroups(ast, indexObject.groups);
                    indexObject.groups = this.resolveAbsoluteSourcePath(indexObject.groups);
                }
                if(indexObject.resources){
                    indexObject.resources = this.fillResourceItems(ast, indexObject.resources);
                }
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
                            group.components.map( component => {
                                result[prop][component.name] = {
                                    name: component.name,
                                    absoluteSource: component.absoluteSource,

                                };
                            });
                        }
                    });
                }
                return result;
            });
    }

    addResources(){
        return this.initIndex()
            .then( indexObject => {
                if(!indexObject.resources){
                    let sourceText = '\n// ' + resource_keyword + '\n';
                    let position = 0;
                    return this.fileManager.placeInPosition(
                        this.sm.getProject('index.filePath'),
                        {text: sourceText, position: position, format: true}
                    );
                }
            })
            .then( () => {
                return this.initIndex();
            });

    }

    addResourceItem(source){
        return this.addResources()
            .then( indexObject => {
                let sourceText = '\nimport \'' + source + '\';\n\n';
                // workaround for ending position of file: comments is not included into the range of program body
                let blockObject = indexObject.resources;
                let position = blockObject.endBlockPosition > blockObject.startBlockPosition ?
                    blockObject.endBlockPosition : blockObject.startBlockPosition;
                return this.fileManager.placeInPosition(
                    this.sm.getProject('index.filePath'),
                    { text: sourceText, position: position, format: true }
                );
            })
            .then( () => {
                return this.initIndex();
            });
    }

    addGroup(groupName){
        return this.initIndex()
            .then( indexObject => {
                if(!indexObject.groups[groupName]){
                    let sourceText = '\n\n//' + group_keyword + ' ' + groupName + '\n';
                    let position = indexObject.endBlockPosition;
                    return this.fileManager.placeInPosition(
                        this.sm.getProject('index.filePath'),
                        {text: sourceText, position: position, format: true}
                    );
                }
            })
            .then( () => {
                return this.initIndex();
            });
    }

    addComponent(groupName, componentName, source){
        return this.addGroup(groupName)
            .then( indexObject => {
                if(indexObject.groups[groupName]){
                    let sourceText = '\nexport { ' + componentName + ' } from \'' + source + '\';\n';
                    // workaround for ending position of file: comments is not included into the range of program body
                    let blockObject = indexObject.groups[groupName];
                    let position = blockObject.endBlockPosition > blockObject.startBlockPosition ?
                        blockObject.endBlockPosition : blockObject.startBlockPosition;
                    return this.fileManager.placeInPosition(
                        this.sm.getProject('index.filePath'),
                        { text: sourceText, position: position, format: true }
                    );
                }
            }).then( () => {
                return this.initIndex();
            });
    }


}

export default IndexManager;