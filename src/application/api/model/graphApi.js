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

import { forOwn, isObject, takeRight, last, initial } from 'lodash';
import { Graph } from 'graphlib';
import { fulex } from '../utils/utils.js';
import { getAvailableRoute } from './reactRouterApi.js';
import { mapModel, makeNodeWrapper, traverseGraphBranch, adjustIndices } from './graphUtils.js';
import { detachGraphNode, detachGraphNodes, copyGraphNode, copyGraphNodes } from './graphUtils.js';

let graphObject = {
    graph: undefined,
    model: undefined,
    pageNodes: []
};

let history = [];

export function pushHistory(pagePath){
    if(history.length >= 50){
        history = takeRight(history, 50);
    }
    history.push({
        model: fulex(graphObject.model),
        markedKeys: getAllMarkedKeys(),
        pagePath: pagePath
    });
}

export function popHistory(){
    if(history.length > 0){
        const historyObject = last(history);
        initGraph(historyObject.model);
        history = initial(history);
        return historyObject;
    }
    return undefined;
}

export function getHistorySize(){
    return history.length;
}

export function initGraph(initialModel){
    if(graphObject.graph){
        delete graphObject.graph;
    }
    if(graphObject.model){
        delete graphObject.model;
    }
    if(graphObject.pageNodes){
        delete graphObject.pageNodes;
    }
    graphObject.model = fulex(initialModel);
    if(graphObject.model && graphObject.model.pages && graphObject.model.pages.length > 0){
        graphObject.graph = new Graph({ compound: true });
        graphObject.graph.setDefaultEdgeLabel('link');
        graphObject.pageNodes = [];
        let pageKey;
        graphObject.model.pages.forEach((page, index) => {
            pageKey = mapModel(graphObject.graph, page, index);
            graphObject.pageNodes.push({
                pagePath: page.pagePath,
                pageName: page.pageName,
                pageKey: pageKey
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

export function getNode(key){
    return graphObject.graph.node(key);
}

export function getWrappedModelByPagePath(pathname){
    let wrappedModel = undefined;
    let paths = [];
    graphObject.pageNodes.forEach(pageNode => {
        paths.push(pageNode.pagePath);
    });
    const path = getAvailableRoute(paths, pathname);
    const pageNode = graphObject.pageNodes.find(pageNode => {
        return pageNode.pagePath === path;
    });
    if(pageNode){
        wrappedModel = traverseGraph(pageNode.pageKey);
    }
    return wrappedModel;
}

export function getMarkedKeysByPagePath(pathname){
    let paths = [];
    graphObject.pageNodes.forEach(pageNode => {
        paths.push(pageNode.pagePath);
    });
    const path = getAvailableRoute(paths, pathname);
    const pageNode = graphObject.pageNodes.find(pageNode => {
        return pageNode.pagePath === path;
    });
    return getMarkedKeys(pageNode ? pageNode.pageKey : undefined);
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

function traverseGraph(rootNodeKey, result){
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
    const { pageNodes } = graphObject;
    let result = [];
    pageNodes.forEach(pNode => {
        result = result.concat(traverseGraph(pNode.pageKey));
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

export function changePagePathAndName(pagePath, nextPagePath, nextPageName){
    const { graph, pageNodes } = graphObject;
    const pageNode = pageNodes.find(pNode => {
        return pNode.pagePath === pagePath;
    });
    if(!pageNode){
        throw Error('Change page path and name: specified path ' + pagePath + ' was not found.');
    }
    let rootNode = graph.node(pageNode.pageKey);
    if(rootNode){
        let modelNode = rootNode.modelNode;
        modelNode.pageName = nextPageName;
        modelNode.pagePath = nextPagePath;
        pageNode.pageName = nextPageName;
        pageNode.pagePath = nextPagePath;
    }
    return graphObject.pageNodes;
}

export function addNewPage(initialModel, pagePath, pageName){
    let { graph, model, pageNodes } = graphObject;
    let pageModel = fulex(initialModel);
    pageModel.pagePath = pagePath;
    pageModel.pageName = pageName;
    model.pages.push(pageModel);
    const pageKey = mapModel(graph, pageModel, pageNodes.length, true);
    pageNodes.push({
        pagePath: pagePath,
        pageName: pageName,
        pageKey: pageKey
    });
    return pageNodes;
}

export function duplicatePage(pagePath){
    let { graph, model, pageNodes } = graphObject;
    const pageNode = pageNodes.find(pNode => {
        return pNode.pagePath === pagePath;
    });
    if(!pageNode){
        throw Error('Duplicate page: specified path ' + pagePath + ' was not found.');
    }
    let rootNode = graph.node(pageNode.pageKey);
    if(rootNode){
        let pageModel = fulex(rootNode.modelNode);
        pageModel.pagePath = pageModel.pagePath + '_copy';
        pageModel.pageName = pageModel.pageName + 'Copy';
        model.pages.push(pageModel);
        const pageKey = mapModel(graph, pageModel, pageNodes.length, true);
        pageNodes.push({
            pagePath: pageModel.pagePath,
            pageName: pageModel.pageName,
            pageKey: pageKey
        });
    }
    return pageNodes;
}

export function setIndexPage(pagePath){
    let { graph, model, pageNodes } = graphObject;

    const pageNode = pageNodes.find(pNode => {
        return pNode.pagePath === pagePath;
    });
    if(!pageNode){
        throw Error('Set index page: specified path ' + pagePath + ' was not found.');
    }

    let rootNode = graph.node(pageNode.pageKey);
    if(rootNode){
        const tempModel = model.pages.splice(rootNode.index, 1)[0];
        if(tempModel){
            model.pages.splice(0, 0, tempModel);
        } else {
            console.error('Page model was not found in pages model index: ' + rootNode.index);
        }
        let newPageNodes = [];
        let newPageNode;
        let graphNode;
        model.pages.forEach((page, index) => {
            newPageNode = pageNodes.find(pNode => {
                return pNode.pagePath === page.pagePath;
            });
            if(newPageNode){
                graphNode = graph.node(newPageNode.pageKey);
                graphNode.index = index;
                newPageNodes.push(newPageNode);
            }
        });
        graphObject.pageNodes = newPageNodes;
    }
    return graphObject.pageNodes;
}

export function deletePage(pagePath){
    let { graph, model, pageNodes } = graphObject;
    const pageNode = pageNodes.find(pNode => {
        return pNode.pagePath === pagePath;
    });
    if(!pageNode){
        throw Error('Delete page: specified path ' + pagePath + ' was not found.');
    }

    let rootNode = graph.node(pageNode.pageKey);
    if(rootNode){
        model.pages.splice(rootNode.index, 1);
        traverseGraphBranch(graph, pageNode.pageKey, (nodeKey => {
            graph.removeNode(nodeKey);
        }));

        let newPageNodes = [];
        let newPageNode;
        let graphNode;
        model.pages.forEach((page, index) => {
            newPageNode = pageNodes.find(pNode => {
                return pNode.pagePath === page.pagePath;
            });
            if(newPageNode){
                graphNode = graph.node(newPageNode.pageKey);
                graphNode.index = index;
                newPageNodes.push(newPageNode);
            }
        });
        graphObject.pageNodes = newPageNodes;
    }
    return graphObject.pageNodes;
}


function getDetachedKeysForCutting(){
    const {graph, pageNodes} = graphObject;
    const testFunc = node => node.isForCutting;
    let detachedKeys = [];
    pageNodes.forEach(pNode => {
        detachGraphNodes(graph, pNode.pageKey, testFunc, detachedKeys);
    });
    return detachedKeys;
}

function getDetachedKeysForCopying(){
    const {graph, pageNodes} = graphObject;
    const testFunc = node => node.isForCopying;
    let detachedKeys = [];
    pageNodes.forEach(pNode => {
        copyGraphNodes(graph, pNode.pageKey, testFunc, detachedKeys);
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
    if(!node.prop){
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
    } else {
        return [nodeKey];
    }
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
    if(!node.prop){
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
    } else {
        return [nodeKey];
    }
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
    if(!node.prop){
        const { forCutting } = getAllMarkedKeys();
        if(forCutting.length !== 1){
            throw Error('Cut & paste wrap: wrapping can be applied only for single component');
        }
        const pastedKeys = cutPasteBeforeOrAfter(nodeKey, false);
        removeForCutting(pastedKeys[0]);
        setForCutting(nodeKey);
        cutPasteFirstOrLast(pastedKeys[0], false);
        removeForCutting(nodeKey);
        return pastedKeys;
    } else {
        return [nodeKey];
    }
}

export function copyPasteBeforeOrAfter(nodeKey, isAfter){
    const {graph} = graphObject;
    const node = graph.node(nodeKey);
    if(!node){
        throw Error('Copy & paste before or after node: node with key ' + nodeKey + ' was not found.');
    }
    if(!node.prop){
        let detachedKeys = getDetachedKeysForCopying();
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
    } else {
        return [nodeKey];
    }
}

export function copyPasteFirstOrLast(nodeKey, isFirst){
    const {graph} = graphObject;
    const node = graph.node(nodeKey);
    if(!node){
        throw Error('Copy & paste first or last node: node with key ' + nodeKey + ' was not found.');
    }
    let detachedKeys = getDetachedKeysForCopying();
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

export function copyPasteReplace(nodeKey){
    const {graph} = graphObject;
    const node = graph.node(nodeKey);
    if(!node){
        throw Error('Copy & paste replace: node with key ' + nodeKey + ' was not found.');
    }
    if(!node.prop){
        let detachedKeys = getDetachedKeysForCopying();
        if(detachedKeys.length > 0) {
            const parentKey = graph.parent(nodeKey);
            if(parentKey){
                const nodeIndex = node.index;
                traverseGraphBranch(graph, nodeKey, (key => {
                    graph.removeNode(key);
                }));
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
    } else {
        return [nodeKey];
    }
}

export function copyPasteWrap(nodeKey){
    const {graph} = graphObject;
    const node = graph.node(nodeKey);
    if(!node){
        throw Error('Copy & paste wrap: node with key ' + nodeKey + ' was not found.');
    }
    if(!node.prop){
        const { forCopying } = getAllMarkedKeys();
        if(forCopying.length !== 1){
            throw Error('Copy & paste wrap: wrapping can be applied only for single component');
        }
        const pastedKeys = copyPasteBeforeOrAfter(nodeKey, false);
        setForCutting(nodeKey);
        cutPasteFirstOrLast(pastedKeys[0], false);
        removeForCutting(nodeKey);
        return pastedKeys;
    } else {
        return [nodeKey];
    }
}

export function cloneSelected(){
    const {graph} = graphObject;
    const { selected } = getAllMarkedKeys();
    let pastedKeys = [];
    if(selected && selected.length > 0){
        let newNodeKey;
        selected.forEach(selectedKey => {
            const parentKey = graph.parent(selectedKey);
            let parentNode = graph.node(parentKey);
            const selectedNode = graph.node(selectedKey);
            if(parentNode && selectedNode && !selectedNode.prop){
                newNodeKey = copyGraphNode(graph, selectedKey);
                let detachedModelNodes = [];
                let detachedNode = graph.node(newNodeKey);
                if(detachedNode && detachedNode.modelNode){
                    graph.setParent(newNodeKey, parentKey);
                    detachedModelNodes.push(detachedNode.modelNode);
                }
                let {modelNode} = parentNode;
                let modelNodesArgs = [selectedNode.index + 1, 0].concat(detachedModelNodes);
                modelNode.children.splice.apply(modelNode.children, modelNodesArgs);
                adjustIndices(graph, parentKey);
                pastedKeys.push(newNodeKey);
            }
        });
    }
    return pastedKeys;
}

export function moveSelected(isUp){
    const {graph} = graphObject;
    const { selected } = getAllMarkedKeys();
    if(selected && selected.length > 0){
        selected.forEach(selectedKey => {
            const parentKey = graph.parent(selectedKey);
            let parentNode = graph.node(parentKey);
            const selectedNode = graph.node(selectedKey);
            if(parentNode && selectedNode && !selectedNode.prop){
                console.log('Moving element: ' + selectedKey + ' up: ' + isUp);
                let {modelNode} = parentNode;
                if(modelNode.children && modelNode.children.length !== 1){
                    if(isUp){
                        console.log('Move index up: ' + selectedNode.index);
                        modelNode.children.splice(selectedNode.index, 1);
                        modelNode.children.splice(selectedNode.index - 1, 0, selectedNode.modelNode);
                    } else {
                        console.log('Move index down: ' + selectedNode.index);
                        modelNode.children.splice(selectedNode.index, 1);
                        modelNode.children.splice(selectedNode.index + 1, 0, selectedNode.modelNode);
                    }
                }
                adjustIndices(graph, parentKey);
            }
        });
    }
}

export function deleteSelected(){
    const {graph, pageNodes} = graphObject;
    const testFunc = node => node.selected;
    let detachedKeys = [];
    pageNodes.forEach(pNode => {
        detachGraphNodes(graph, pNode.pageKey, testFunc, detachedKeys);
    });
    if(detachedKeys.length > 0){
        let childNode;
        detachedKeys.forEach(key => {
            traverseGraphBranch(graph, key, childKey => {
                childNode = graph.node(childKey);
                if(childNode){
                    delete childNode.modelNode;
                    graph.removeNode(childKey);
                }
            });
        });
    }
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

export function setForCopying(nodeKey){
    const {graph} = graphObject;
    let node = graph.node(nodeKey);
    if(node){
        node.isForCopying = true;
    }
}

export function removeForCopying(nodeKey){
    const {graph} = graphObject;
    let node = graph.node(nodeKey);
    if(node){
        node.isForCopying = undefined;
    }
}

export function removeClipboardMarks(nodeKey){
    removeForCutting(nodeKey);
    removeForCopying(nodeKey);
}

export function getMarkedKeys(rootKey){
    let selected = [];
    let highlighted = [];
    let forCutting = [];
    let forCopying = [];
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
            if(childNode.isForCopying){
                forCopying.push(key);
            }
        }
    }));
    console.log('Get marked keys, root: ' + rootKey +
        ', selected: ' + selected.length +
        ', highlighted: ' + highlighted.length +
        ', forCutting: ' + forCutting.length +
        ', forCopying: ' + forCopying.length);
    return { selected, highlighted, forCutting, forCopying };
}

export function getAllMarkedKeys(){
    const { graph, pageNodes } = graphObject;
    let result = undefined;
    pageNodes.forEach(pNode => {
        if(!result){
            result = getMarkedKeys(pNode.pageKey);
        } else {
            const {selected, highlighted, forCutting, forCopying} = getMarkedKeys(pNode.pageKey);
            result.selected = result.selected.concat(selected);
            result.highlighted = result.highlighted.concat(highlighted);
            result.forCutting = result.forCutting.concat(forCutting);
            result.forCopying = result.forCopying.concat(forCopying);
        }
    });
    return result;
}
