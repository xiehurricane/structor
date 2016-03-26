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
import { uniqueId, forOwn, isObject } from 'lodash';
import { Graph } from 'graphlib';
import { fulex } from '../utils/utils.js';

let graph;
let model;

function mapModel(rootKey, rootModelNode, rootIndex, prop) {
    graph.setNode(rootKey, { modelNode: rootModelNode, index: rootIndex, prop });
    forOwn(rootModelNode.props, (value, prop) => {
        if (isObject(value) && value.type) {
            const childKey = uniqueId();
            mapModel(childKey, value, 0, prop);
            graph.setParent(childKey, rootKey);
        }
    });
    const { children } = rootModelNode;
    if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            const childKey = uniqueId();
            mapModel(childKey, children[i], i);
            graph.setParent(childKey, rootKey);
        }
    }
}

function adjustIndices(parentKey){
    const parentNode = graph.node(parentKey);
    const parentChildren = graph.children(parentKey);
    if(parentNode && parentChildren && parentChildren.length > 0){
        let childNode;
        parentChildren.forEach(childKey => {
            childNode = graph.node(childKey);
            if(childNode){
                if(childNode.prop){
                    childNode.index = 0;
                } else if(parentNode.modelNode.children && parentNode.modelNode.children.length > 0){
                    childNode.index = parentNode.modelNode.children.indexOf(childNode.modelNode);
                    console.log('Found index ' + childNode.index + ' for: ' + childKey)
                } else {
                    childNode.index = 0;
                }
            }
        });
    }
}

function getSelection(selectedKeys){
    let result = {};
    if(selectedKeys && selectedKeys.length > 0){
        result.selectedNodes = [];
        selectedKeys.forEach(key => {
            if(!result.parentSelectedKey){
                result.parentSelectedKey = graph.parent(key);
            } else if(result.parentSelectedKey !== graph.parent(key)) {
                throw Error('The parent key has to be the same for all selected keys');
            }
            result.selectedNodes.push(graph.node(key));
        });
        result.selectedNodes.sort((a, b) => a.index - b.index);
    }
    return result;
}

function removeFromParent(selectedKeys, parentSelectedKey, selectedNodes){
    let selectedModelNodes = [];
    selectedNodes.forEach(selectedNode => {
        selectedModelNodes.push(selectedNode.modelNode);
    });
    let parentSelectedNode = graph.node(parentSelectedKey);
    if(parentSelectedNode){
        if(parentSelectedNode.modelNode.children.length > 0){
            let newModelNodes = [];
            parentSelectedNode.modelNode.children.forEach(childNode => {
                if(selectedModelNodes.indexOf(childNode) < 0){
                    newModelNodes.push(childNode);
                }
            });
            parentSelectedNode.modelNode.children = newModelNodes;
        }
        selectedKeys.forEach(selectedKey => {
            graph.setParent(selectedKey, undefined);
        });
        adjustIndices(parentSelectedKey);
    }
    return selectedModelNodes;
}

function addNewToParent(parentKey, selectedNodes){
    let newModelNodes = [];
    let newModelNode;
    let newNodeKey;
    selectedNodes.forEach(selectedNode => {
        newModelNode = fulex(selectedNode.modelNode);
        newModelNodes.push(newModelNode);
        newNodeKey = uniqueId();
        mapModel(newNodeKey, newModelNode, -1, selectedNode.prop);
        graph.setParent(newNodeKey, parentKey);
    });
    return newModelNodes;
}

export function initGraph(projectModel){
    model = fulex(projectModel);
    if(model && model.pages && model.pages.length > 0){
        graph = new Graph({ compound: true });
        graph.setDefaultEdgeLabel('link');
        model.pages.forEach((page, index) => {
            mapModel(page.pagePath, page, index);
        });
    }
    return graph;
}

export function getGraph(){
    return graph;
}

export function getNode(key){
    return graph.node(key);
}

export function getModel(){
    return model;
}

export function getModelNode(key){
    const node = graph.node(key);
    if(node){
        return node.modelNode;
    }
    return undefined;
}

export function traverseGraph(rootNodeKey, result){
    let rootNode = graph.node(rootNodeKey);
    if(rootNode){
        let resultNode = {
            key: rootNodeKey,
            modelNode: rootNode.modelNode,
            index: rootNode.index,
            prop: rootNode.prop,
            selected: rootNode.selected
        };
        let children = graph.children(rootNodeKey);
        if(children && children.length > 0){
            children.forEach(child => {
                traverseGraph(child, resultNode);
            });
            if(resultNode.children && resultNode.children.length > 0){
                resultNode.children.sort((a, b) => a.index - b.index);
            }
        }
        if(!result){
            result = resultNode;
        } else if(rootNode.prop){
            result.props = result.props || {};
            result.props[rootNode.prop] = resultNode;
        } else {
            result.children = result.children || [];
            result.children.push(resultNode);
        }
    }
    return result;
}

export function moveAfterOrBeforeNode(selectedKeys, afterKey, isAfter){
    const {parentSelectedKey, selectedNodes} = getSelection(selectedKeys);
    let afterNode = graph.node(afterKey);
    if(selectedNodes && afterNode){
        let selectedModelNodes = removeFromParent(selectedKeys, parentSelectedKey, selectedNodes);
        const parentAfterKey = graph.parent(afterKey);
        let parentAfterNode = graph.node(parentAfterKey);
        if(parentAfterNode){
            //console.log('Before Parent has: ' + parentAfterNode.modelNode.children.length);
            let modelNodesArgs = [afterNode.index + (isAfter ? 1 : 0), 0].concat(selectedModelNodes);
            parentAfterNode.modelNode.children.splice.apply(parentAfterNode.modelNode.children, modelNodesArgs);
            selectedKeys.forEach(selectedKey => {
                graph.setParent(selectedKey, parentAfterKey);
            });
            //console.log('After Parent has: ' + parentAfterNode.modelNode.children.length);
            adjustIndices(parentAfterKey);
        }
    }
}

export function copyAfterOrBeforeNode(selectedKeys, afterKey, isAfter){
    const {parentSelectedKey, selectedNodes} = getSelection(selectedKeys);
    let afterNode = graph.node(afterKey);
    if(selectedNodes && afterNode){
        const parentAfterKey = graph.parent(afterKey);
        let parentAfterNode = graph.node(parentAfterKey);
        if(parentAfterNode){
            let newModelNodes = addNewToParent(parentAfterKey, selectedNodes);
            //console.log('Before Parent has: ' + parentAfterNode.modelNode.children.length);
            let modelNodesArgs = [afterNode.index + (isAfter ? 1 : 0), 0].concat(newModelNodes);
            parentAfterNode.modelNode.children.splice.apply(parentAfterNode.modelNode.children, modelNodesArgs);
            //console.log('After Parent has: ' + parentAfterNode.modelNode.children.length);
            adjustIndices(parentAfterKey);
        }
    }
}

export function moveAsFirstOrLast(selectedKeys, parentKey, isFirst){
    const {parentSelectedKey, selectedNodes} = getSelection(selectedKeys);
    let parentNode = graph.node(parentKey);
    if(selectedNodes && parentNode){
        let selectedModelNodes = removeFromParent(selectedKeys, parentSelectedKey, selectedNodes);
        parentNode.modelNode.children = parentNode.modelNode.children || [];
        const lastIndex = parentNode.modelNode.children ? parentNode.modelNode.children.length : 0;
        let modelNodesArgs = [(isFirst ? 0 : lastIndex), 0].concat(selectedModelNodes);
        parentNode.modelNode.children.splice.apply(parentNode.modelNode.children, modelNodesArgs);
        selectedKeys.forEach(selectedKey => {
            graph.setParent(selectedKey, parentKey);
        });
        adjustIndices(parentKey);
    }
}

export function copyAsFirstOrLast(selectedKeys, parentKey, isFirst){
    const {parentSelectedKey, selectedNodes} = getSelection(selectedKeys);
    let parentNode = graph.node(parentKey);
    if(selectedNodes && parentNode){
        let newModelNodes = addNewToParent(parentKey, selectedNodes);
        //console.log('Before Parent has: ' + parentAfterNode.modelNode.children.length);
        parentNode.modelNode.children = parentNode.modelNode.children || [];
        const lastIndex = parentNode.modelNode.children ? parentNode.modelNode.children.length : 0;
        let modelNodesArgs = [(isFirst ? 0 : lastIndex), 0].concat(newModelNodes);
        parentNode.modelNode.children.splice.apply(parentNode.modelNode.children, modelNodesArgs);
        //console.log('After Parent has: ' + parentAfterNode.modelNode.children.length);
        adjustIndices(parentKey);
    }
}
