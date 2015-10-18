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
                    overflow: 'auto',
                    width: '100%',
                    height: '100%'
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
        console.log('Current overlay plugin is destroyed');
    }
}

export function pushUndoState(model){
    if(undoPool.length >= 50){
        undoPool = _.rest(undoPool, 50);
    }
    undoPool.push({
        projectModel: Utils.fulex(model)
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