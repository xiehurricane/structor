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

//import { Map, List, fromJS } from 'immutable';
import * as Utils from './utils.js';
import _ from 'lodash';
//
let nodeMap = {};
let frameWindow = null;
let $currentOverlayPlugin = null;
let undoPool = [];
//
function findComponent(index, componentName, level, result){
    let _result = result || {};
    if(index && _.isObject(index) && level <= 1){
        level++;
        _.forOwn(index, (value, key) => {
            if(!_result.value){
                if(key === componentName){
                    _result.value = value;
                } else if(value && _.isObject(value)){
                    _result = findComponent(value, componentName, level, _result);
                    if(_result.value){
                        _result.group = key;
                    }
                }
            }
        });
    }
    return _result;
}
//
export function getComponentFromTree(tree, componentName){
    return findComponent(tree, componentName, 0);
}
//
export function cleanProjectModel(projectModel, componentsTree){
    var test = function(type){
        var testComponent = findComponent(componentsTree, type, 0);
        return !!testComponent.value;
    };
    if(projectModel && projectModel.pages){
        _.each(projectModel.pages, function(page){
            Utils.deleteInvalidTypeItems(page, test);
        });
    }
}
//
export const templatePreviewPageModel = {
    pageName: 'TemplatePage',
    children:[
        {
            type: 'div',
            props: {
                style: {
                    padding: '0.5em',
                    width: '100%'
                }
            },
            children:[
                {type: 'h4', children:[ { type: 'span', text: ''} ]},
                {type: 'hr', props: { style: { marginBottom: '2em' } } }
            ]
        }
    ]
};
//
export function setPageDomNode(key, DOMNode){
    nodeMap[key] = DOMNode;
}

export function resetPageDomNode(){
    nodeMap = {};
}

export function hasPageDomNode(key){
    return !!nodeMap[key];
}

export function getPageDomNode(key){
    return nodeMap[key];
}

export function getPageDomNodeMap(){
    return nodeMap;
}

export function setFrameWindow(window){
    frameWindow = window;
}

export function getFrameWindow(){
    return frameWindow;
}

export function resetFrameWindow(){
    frameWindow = null;
}

export function setCurrentOverlayPlugin($overlayObj){
    destroyCurrentOverlayPlugin();
    $currentOverlayPlugin = $overlayObj;
}

export function destroyCurrentOverlayPlugin(){
    if($currentOverlayPlugin){
        $currentOverlayPlugin.destroy();
        $currentOverlayPlugin = null;
        //console.log('Current overlay plugin is destroyed');
    }
}

export function removeMarksFromModel(model){
    if(model && model.pages){
        _.each(model.pages, function(page){
            Utils.removeClassNamesFromModel(['umy-grid-basic-border-copy', 'umy-grid-basic-border-cut'], page);
        });
    }
    return model;
}

export function pushUndoState(model){
    if(undoPool.length >= 50){
        undoPool = _.rest(undoPool, 50);
    }
    undoPool.push({
        projectModel: model
    });
}

export function popUndoState(){
    if(undoPool.length > 0){
        let undoState = _.last(undoPool);
        let projectModel = undoState.projectModel;
        undoPool = _.initial(undoPool);
        return projectModel;
    } else {
        return null;
    }
}

export function getTemplatePageModel(){
    return {
        pageName: 'UnnamedPage',
        pagePath: '/UnnamedPage',
        children: [
            {
                type: 'h3',
                props: {
                    style: {
                        padding: '1em',
                        textAlign: 'center'
                    }
                },
                children: [
                    {
                        type: 'span',
                        text: 'This is an empty page. ' +
                        'To add new component select needed element on left-side ' +
                        'panel and click on an element on the page where you want to put new component, ' +
                        'than choose action for right component\'s place.'
                    }
                ]
            }
        ]
    };
}