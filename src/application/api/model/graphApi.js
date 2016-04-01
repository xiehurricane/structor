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
import { getAvailableRoute } from './reactRouterApi.js';

let graphObject = {
    graph: undefined,
    model: undefined,
    rootKeys: [],
    pageNodes: []
};

function mapModel(srcGraph, rootKey, rootModelNode, rootIndex, prop) {
    srcGraph.setNode(rootKey, { modelNode: rootModelNode, index: rootIndex, prop });
    forOwn(rootModelNode.props, (value, prop) => {
        if (isObject(value) && value.type) {
            const childKey = uniqueId();
            mapModel(srcGraph, childKey, value, 0, prop);
            srcGraph.setParent(childKey, rootKey);
        }
    });
    const { children } = rootModelNode;
    if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            const childKey = uniqueId();
            mapModel(srcGraph, childKey, children[i], i);
            srcGraph.setParent(childKey, rootKey);
        }
    }
}

function makeNodeWrapper(key, graphNode){
    return {
        key: key,
        //modelNode: graphNode.modelNode.type + ' ' + graphNode.modelNode.props['data-umyid'],
        modelNode: graphNode.modelNode,
        index: graphNode.index,
        prop: graphNode.prop,
        selected: graphNode.selected,
        highlighted: graphNode.highlighted,
        isForCutting: graphNode.isForCutting,
        isForCuttingChild: graphNode.isForCuttingChild
    };
}

function traverseGraphBranch(srcGraph, rootKey, cbFunc){
    const children = srcGraph.children(rootKey);
    if(children && children.length){
        children.forEach(key => {
            traverseGraphBranch(srcGraph, key, cbFunc);
        });
    }
    if(cbFunc){
        cbFunc(rootKey);
    }
}

function adjustIndices(srcGraph, nodeKey){
    const parentNode = srcGraph.node(nodeKey);
    const parentChildren = srcGraph.children(nodeKey);
    if(parentNode && parentChildren && parentChildren.length > 0){
        let childNode;
        parentChildren.forEach(childKey => {
            childNode = srcGraph.node(childKey);
            if(childNode){
                if(childNode.prop){
                    childNode.index = 0;
                } else if(parentNode.modelNode.children && parentNode.modelNode.children.length > 0){
                    childNode.index = parentNode.modelNode.children.indexOf(childNode.modelNode);
                } else {
                    childNode.index = 0;
                }
            }
        });
    }
}

export function initGraph(initialModel){
    graphObject.model = fulex(initialModel);
    if(graphObject.model && graphObject.model.pages && graphObject.model.pages.length > 0){
        graphObject.graph = new Graph({ compound: true });
        graphObject.graph.setDefaultEdgeLabel('link');
        graphObject.rootKeys = [];
        graphObject.pageNodes = [];
        graphObject.model.pages.forEach((page, index) => {
            mapModel(graphObject.graph, page.pagePath, page, index);
            graphObject.rootKeys.push(page.pagePath);
            graphObject.pageNodes.push({
                pagePath: page.pagePath,
                pageName: page.pageName
            });
        });
    }
}

export function getGraph(){
    return graphObject.graph;
}

export function getModel(){
    return graphObject.model;
}

export function getPages(){
    return graphObject.pageNodes;
}

export function getRoots(){
    return graphObject.rootKeys;
}

export function getNode(key){
    return graphObject.graph.node(key);
}

export function getWrappedModelByPagePath(pathname){
    const roots = getRoots();
    const rootKey = getAvailableRoute(roots, pathname);
    let wrappedModel = undefined;
    if(rootKey){
        wrappedModel = traverseGraph(rootKey);
    }
    return wrappedModel;
}

export function getMarkedKeysByPagePath(pathname){
    const roots = getRoots();
    const rootKey = getAvailableRoute(roots, pathname);
    return getMarkedKeys(rootKey);
}

export function getChildNodes(key){
    let result = [];
    const children = graphObject.graph.children(key);
    if(children && children.length > 0){
        children.forEach(child => {
            result.push(makeNodeWrapper(child, graphObject.graph.node(child)));
        });
        result.sort((a, b) => a.index - b.index);
    }
    return result;
}

export function hasNode(key){
    return graphObject.graph.hasNode(key);
}

export function traverseGraph(rootNodeKey, result){
    const { graph } = graphObject;
    let rootNode = graph.node(rootNodeKey);
    if(rootNode){
        let resultNode = makeNodeWrapper(rootNodeKey, rootNode);
        const parentKey = graph.parent(rootNodeKey);
        if(!parentKey){
            resultNode.isRoot = true;
        }
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

export function traverseAllGraph(){
    const { rootKeys } = graphObject;
    let result = [];
    rootKeys.forEach(key => {
        result = result.concat(traverseGraph(key));
    });
    return result;
}

export function getParentsList(childNodeKey, result){
    const { graph } = graphObject;
    let childNode = graph.node(childNodeKey);
    if(childNode){
        let childModelNode = makeNodeWrapper(childNodeKey, childNode);
        result = result || [];
        result.push(childModelNode);
        const parentNodeKey = graph.parent(childNodeKey);
        if(parentNodeKey){
            getParentsList(parentNodeKey, result);
        } else {
            childModelNode.isRoot = true;
        }
    }
    return result;
}

export function changePagePathAndName(rootKey, nextPagePath, nextPageName){
    const { graph, rootKeys } = graphObject;
    const rootKeyIndex = rootKeys.indexOf(rootKey);
    if(rootKeyIndex < 0){
        throw Error('Change page path and name: specified key ' + rootKey + ' is not root key.');
    }
    let rootNode = graph.node(rootKey);
    if(rootNode){
        let modelNode = rootNode.modelNode;
        modelNode.pageName = nextPageName;
        modelNode.pagePath = nextPagePath;
        const childKeys = graph.children(rootKey);
        graph.removeNode(rootKey);
        graph.setNode(nextPagePath, rootNode);
        if(childKeys && childKeys.length > 0){
            childKeys.forEach(key => {
                graph.setParent(key, nextPagePath);
            });
        }
        graphObject.rootKeys.splice(rootKeyIndex, 1, nextPagePath);
        graphObject.pageNodes.splice(rootKeyIndex, 1, { pagePath: nextPagePath, pageName: nextPageName });
    }
    return graphObject.pageNodes;
}

export function addNewPage(initialModel, pagePath, pageName){
    let { graph, model, rootKeys, pageNodes } = graphObject;
    let pageModel = fulex(initialModel);
    pageModel.pagePath = pagePath;
    pageModel.pageName = pageName;
    model.pages.push(pageModel);
    mapModel(graph, pagePath, pageModel, rootKeys.length);
    rootKeys.push(pagePath);
    pageNodes.push({
        pagePath: pagePath,
        pageName: pageName
    });
    return pageNodes;
}

export function duplicatePage(rootKey){
    let { graph, model, rootKeys, pageNodes } = graphObject;
    const rootNode = graph.node(rootKey);
    if(!rootNode){
        throw Error('Duplicate page: specified key ' + rootKey + 'is not root key.');
    }
    let pageModel = fulex(rootNode.modelNode);
    pageModel.pagePath = pageModel.pagePath + '_copy';
    pageModel.pageName = pageModel.pageName + 'Copy';
    model.pages.push(pageModel);
    mapModel(graph, pageModel.pagePath, pageModel, rootKeys.length);
    rootKeys.push(pageModel.pagePath);
    pageNodes.push({
        pagePath: pageModel.pagePath,
        pageName: pageModel.pageName
    });
    return pageNodes;
}

export function setIndexPage(rootKey){
    let { graph, model } = graphObject;
    const rootNode = graph.node(rootKey);
    if(!rootNode){
        throw Error('Set index page: specified key ' + rootKey + 'is not root key.');
    }
    const tempModel = model.pages.splice(rootNode.index, 1)[0];
    if(tempModel){
        model.pages.splice(0, 0, tempModel);
    } else {
        console.error('Page model was not found in pages model index: ' + rootNode.index);
    }
    graphObject.pageNodes = [];
    graphObject.rootKeys = [];
    let pageNode;
    model.pages.forEach((page, index) => {
        pageNode = graph.node(page.pagePath);
        pageNode.index = index;
        graphObject.rootKeys.push(page.pagePath);
        graphObject.pageNodes.push({
            pagePath: page.pagePath,
            pageName: page.pageName
        });
    });
    return graphObject.pageNodes;
}

export function deletePage(rootKey){
    let { graph, model } = graphObject;
    const rootNode = graph.node(rootKey);
    if(!rootNode){
        throw Error('Delete page: specified key ' + rootKey + 'is not root key.');
    }
    model.pages.splice(rootNode.index, 1);
    traverseGraphBranch(graph, rootKey, (nodeKey => {
        graph.removeNode(nodeKey);
    }));
    graphObject.pageNodes = [];
    graphObject.rootKeys = [];
    let pageNode;
    model.pages.forEach((page, index) => {
        pageNode = graph.node(page.pagePath);
        pageNode.index = index;
        graphObject.rootKeys.push(page.pagePath);
        graphObject.pageNodes.push({
            pagePath: page.pagePath,
            pageName: page.pageName
        });
    });
    return graphObject.pageNodes;
}

function detachGraphNode(srcGraph, nodeKey){
    let cutNode = srcGraph.node(nodeKey);
    if(!cutNode){
        throw Error('Detach graph node: node key ' + nodeKey + ' was not found.');
    }
    const parentNodeKey = srcGraph.parent(nodeKey);
    if(parentNodeKey){
        let parentNode = srcGraph.node(parentNodeKey);
        if(parentNode && parentNode.modelNode){
            let { modelNode: parentModelNode } = parentNode;
            if(cutNode.prop){
                if(!parentModelNode.props[cutNode.prop]){
                    throw Error('Detach graph node: model node with key ' + parentNodeKey + ' does not have prop ' + cutNode.prop);
                }
                parentModelNode.props[cutNode.prop] = undefined;
                cutNode.prop = undefined;
            } else if(parentModelNode.children && parentModelNode.children.length > 0) {
                const childIndex = parentModelNode.children.indexOf(cutNode.modelNode);
                if (childIndex < 0) {
                    throw Error('Detach graph node: child model node with key ' + nodeKey + ' does not belong to parent node with key ' + parentNodeKey);
                }
                parentModelNode.children.splice(childIndex, 1);
            } else {
                throw Error('Detach graph node: parent node ' + parentNodeKey + ' does not have children or needed prop.');
            }
            adjustIndices(srcGraph, parentNodeKey);
        } else {
            throw Error('Detach graph node: parent node ' + parentNodeKey + ' is missing or does not have linked modelNode.')
        }
        srcGraph.setParent(nodeKey, undefined);
    }
    return nodeKey;
}

function detachGraphNodes(srcGraph, rootNodeKey, testFunc, detachedKeys){
    detachedKeys = detachedKeys || [];
    const parentNode = srcGraph.node(rootNodeKey);
    if(parentNode){
        let childKeys = srcGraph.children(rootNodeKey);
        if(testFunc(parentNode)){
            detachedKeys.push(detachGraphNode(srcGraph, rootNodeKey));
        }
        if(childKeys && childKeys.length > 0){
            let sortedChildrenNodes = [];
            let propChildrenNodes = [];
            let childNode;
            childKeys.forEach(childKey => {
                childNode = srcGraph.node(childKey);
                if(childNode){
                    if(childNode.prop){
                        propChildrenNodes.push({
                            key: childKey,
                            node: childNode
                        });
                    } else {
                        sortedChildrenNodes.push({
                            key: childKey,
                            node: childNode
                        });
                    }
                }
            });
            if(sortedChildrenNodes.length > 0){
                sortedChildrenNodes.sort((a, b) => a.node.index - b.node.index);
            }
            propChildrenNodes.forEach(childNode => {
                detachGraphNodes(srcGraph, childNode.key, testFunc, detachedKeys);
            });
            sortedChildrenNodes.forEach(childNode => {
                detachGraphNodes(srcGraph, childNode.key, testFunc, detachedKeys);
            });
        }
    }
}

function getDetachedKeysForCutting(){
    const {graph, rootKeys} = graphObject;
    const testFunc = node => node.isForCutting;
    let detachedKeys = [];
    rootKeys.forEach(key => {
        detachGraphNodes(graph, key, testFunc, detachedKeys);
    });
    return detachedKeys;
}

export function isCutPasteAvailable(nodeKey){
    let childNode = graphObject.graph.node(nodeKey);
    return !!(childNode && !childNode.isForCuttingChild && !childNode.isForCutting);
}

export function cutPasteBeforeOrAfter(nodeKey, isAfter){
    if(!isCutPasteAvailable(nodeKey)){
        throw Error('Node with key ' + nodeKey + ' is not available to cut & paste operation.');
    }
    const {graph} = graphObject;
    const node = graph.node(nodeKey);
    if(!node){
        throw Error('Cut & paste before or after node: node with key ' + nodeKey + ' was not found.');
    }
    let detachedKeys = getDetachedKeysForCutting();
    if(detachedKeys.length > 0){
        const parentKey = graph.parent(nodeKey);
        if(parentKey){
            let detachedModelNodes = [];
            let detachedNode;
            detachedKeys.forEach(detachedKey => {
                detachedNode = graph.node(detachedKey);
                if(detachedNode && detachedNode.modelNode){
                    graph.setParent(detachedKey, parentKey);
                    detachedModelNodes.push(detachedNode.modelNode);
                }
            });
            let parentNode = graph.node(parentKey);
            let {modelNode} = parentNode;
            let modelNodesArgs = [node.index + (isAfter ? 1 : 0), 0].concat(detachedModelNodes);
            modelNode.children.splice.apply(modelNode.children, modelNodesArgs);
            adjustIndices(graph, parentKey);
        }
    }
    return detachedKeys;
}

export function cutPasteFirstOrLast(nodeKey, isFirst){
    if(!isCutPasteAvailable(nodeKey)){
        throw Error('Node with key ' + nodeKey + ' is not available to cut & paste operation.');
    }
    const {graph} = graphObject;
    const node = graph.node(nodeKey);
    if(!node){
        throw Error('Cut & paste first or last node: node with key ' + nodeKey + ' was not found.');
    }
    let detachedKeys = getDetachedKeysForCutting();
    if(detachedKeys.length > 0){
        node.modelNode.children = node.modelNode.children || [];
        let detachedModelNodes = [];
        let detachedNode;
        detachedKeys.forEach(detachedKey => {
            detachedNode = graph.node(detachedKey);
            if(detachedNode && detachedNode.modelNode){
                graph.setParent(detachedKey, nodeKey);
                detachedModelNodes.push(detachedNode.modelNode);
            }
        });
        let {modelNode} = node;
        const lastIndex = modelNode.children ? modelNode.children.length : 0;
        let modelNodesArgs = [(isFirst ? 0 : lastIndex), 0].concat(detachedModelNodes);
        modelNode.children.splice.apply(modelNode.children, modelNodesArgs);
        adjustIndices(graph, nodeKey);
    }
    return detachedKeys;
}

export function cutPasteReplace(nodeKey){
    if(!isCutPasteAvailable(nodeKey)){
        throw Error('Node with key ' + nodeKey + ' is not available to cut & paste operation.');
    }
    const {graph} = graphObject;
    const node = graph.node(nodeKey);
    if(!node){
        throw Error('Cut & paste replace: node with key ' + nodeKey + ' was not found.');
    }
    let detachedKeys = getDetachedKeysForCutting();
    if(detachedKeys.length > 0) {
        const parentKey = graph.parent(nodeKey);
        if(parentKey){
            const nodeIndex = node.index;
            traverseGraphBranch(graph, nodeKey, (key => {
                graph.removeNode(key);
            }));
            node.modelNode.children = node.modelNode.children || [];
            let detachedModelNodes = [];
            let detachedNode;
            detachedKeys.forEach(detachedKey => {
                detachedNode = graph.node(detachedKey);
                if(detachedNode && detachedNode.modelNode){
                    graph.setParent(detachedKey, parentKey);
                    detachedModelNodes.push(detachedNode.modelNode);
                }
            });
            let parentNode = graph.node(parentKey);
            let {modelNode} = parentNode;
            let modelNodesArgs = [nodeIndex, 1].concat(detachedModelNodes);
            modelNode.children.splice.apply(modelNode.children, modelNodesArgs);
            adjustIndices(graph, parentKey);
        }
    }
    return detachedKeys;
}

export function cutPasteWrap(nodeKey){
    if(!isCutPasteAvailable(nodeKey)){
        throw Error('Node with key ' + nodeKey + ' is not available to cut & paste operation.');
    }
    const {graph} = graphObject;
    const node = graph.node(nodeKey);
    if(!node){
        throw Error('Cut & paste wrap: node with key ' + nodeKey + ' was not found.');
    }
    const { forCutting } = getAllMarkedKeys();
    if(forCutting.length !== 1){
        throw Error('Cut & paste wrap: wrapping can be applied only for single component');
    }
    const pastedKeys = cutPasteBeforeOrAfter(nodeKey, false);
    removeForCutting(pastedKeys[0]);
    setForCutting(nodeKey);
    cutPasteFirstOrLast(pastedKeys[0], false);
    return pastedKeys;

}

export function setForCutting(nodeKey){
    const {graph} = graphObject;
    let node = graph.node(nodeKey);
    if(node){
        node.isForCutting = true;
        traverseGraphBranch(graph, nodeKey, (key => {
            let childNode = graph.node(key);
            childNode.isForCuttingChild = true;
        }));
    }
}

export function removeForCutting(nodeKey){
    const {graph} = graphObject;
    let node = graph.node(nodeKey);
    if(node){
        node.isForCutting = undefined;
        traverseGraphBranch(graph, nodeKey, (key => {
            let childNode = graph.node(key);
            childNode.isForCuttingChild = undefined;
        }));
    }
}

export function getMarkedKeys(rootKey){
    let selected = [];
    let highlighted = [];
    let forCutting = [];
    const {graph} = graphObject;
    traverseGraphBranch(graph, rootKey, (key => {
        let childNode = graph.node(key);
        if(childNode){
            if(childNode.highlighted){
                highlighted.push(key);
            }
            if(childNode.selected){
                selected.push(key);
            }
            if(childNode.isForCutting){
                forCutting.push(key);
            }
        }
    }));
    console.log('Get marked keys, root: ' + rootKey + ', selected: ' + selected.length + ', highlighted: ' + highlighted.length + ', forCutting: ' + forCutting.length);
    return { selected, highlighted, forCutting };
}

export function getAllMarkedKeys(){
    const { graph, rootKeys } = graphObject;
    let result = undefined;
    rootKeys.forEach(rootKey => {
        if(!result){
            result = getMarkedKeys(rootKey);
        } else {
            const {selected, highlighted, forCutting} = getMarkedKeys(rootKey);
            result.selected = result.selected.concat(selected);
            result.highlighted = result.highlighted.concat(highlighted);
            result.forCutting = result.forCutting.concat(forCutting);
        }
    });
    return result;
}
