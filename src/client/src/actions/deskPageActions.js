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

import 'isomorphic-fetch';

import * as ServerActions from './serverActions.js';

export const SET_COMPONENT_SELECTION = 'SET_COMPONENT_SELECTION';
export const DISCARD_COMPONENT_SELECTION = 'DISCARD_COMPONENT_SELECTION';
export const SHOW_AVAILABLE_COMPONENT_PREVIEW = 'SHOW_AVAILABLE_COMPONENT_PREVIEW';
export const HIDE_AVAILABLE_COMPONENT_PREVIEW = 'HIDE_AVAILABLE_COMPONENT_PREVIEW';
export const SET_AVAILABLE_COMPONENT_DEFAULT_INDEX = 'SET_AVAILABLE_COMPONENT_DEFAULT_INDEX';
export const DELETE_AVAILABLE_COMPONENT_PREVIEW_INDEX = 'DELETE_AVAILABLE_COMPONENT_PREVIEW_INDEX';

export const SET_FOCUSED_QUICK_OPTION_PATH = 'SET_FOCUSED_QUICK_OPTION_PATH';

export const SWITCH_PAGE_TO_INDEX = 'SWITCH_PAGE_TO_INDEX';
export const SWITCH_PAGE_TO_PATH = 'SWITCH_PAGE_TO_PATH';
export const COMMAND_RELOAD_PAGE = 'COMMAND_RELOAD_PAGE';

export const CHANGE_MODEL_NODE_OPTIONS = 'CHANGE_MODEL_NODE_OPTIONS';
export const REWRITE_MODEL_NODE = 'REWRITE_MODEL_NODE';
export const DELETE_MODEL_NODE_OPTION_BY_PATH = 'DELETE_MODEL_NODE_OPTION_BY_PATH';
export const PASTE_IN_MODEL_FROM_CLIPBOARD = 'PASTE_IN_MODEL_FROM_CLIPBOARD';
export const DELETE_IN_MODEL_SELECTED = 'DELETE_IN_MODEL_SELECTED';
export const DISCARD_CLIPBOARD = 'DISCARD_CLIPBOARD';
export const UNDO_MODEL = 'UNDO_MODEL';
export const MOVE_IN_MODEL_SELECTED = 'MOVE_IN_MODEL_SELECTED';
export const COPY_SELECTED_IN_CLIPBOARD = 'COPY_SELECTED_IN_CLIPBOARD';
export const CUT_SELECTED_IN_CLIPBOARD = 'CUT_SELECTED_IN_CLIPBOARD';
export const PASTE_DELETE_IN_MODEL_FROM_CLIPBOARD = 'PASTE_DELETE_IN_MODEL_FROM_CLIPBOARD';
export const DUPLICATE_IN_MODEL_SELECTED = 'DUPLICATE_IN_MODEL_SELECTED';
export const START_QUICK_PASTE_IN_MODEL_BY_NAME = 'START_QUICK_PASTE_IN_MODEL_BY_NAME';
export const STOP_QUICK_PASTE_IN_MODEL_BY_NAME = 'STOP_QUICK_PASTE_IN_MODEL_BY_NAME';
export const QUICK_PASTE_IN_MODEL_BY_NAME = 'QUICK_PASTE_IN_MODEL_BY_NAME';

export const ADD_NEW_PAGE = 'ADD_NEW_PAGE';
export const COPY_CURRENT_PAGE = 'COPY_CURRENT_PAGE';
export const DELETE_CURRENT_PAGE = 'DELETE_CURRENT_PAGE';
export const CHANGE_CURRENT_PAGE_INFO = 'CHANGE_CURRENT_PAGE_INFO';

//--- Transferable action ----------------------------------------------------------------------------------------------

export const DATA_PROJECT_MODEL = 'DATA_PROJECT_MODEL';
export const DATA_PROJECT_COMPONENTS_TREE = 'DATA_PROJECT_COMPONENTS_TREE';
export const SELECT_AVAILABLE_COMPONENT = 'SELECT_AVAILABLE_COMPONENT';

// ---------------------------------------------------------------------------------------------------------------------
export function setComponentSelection(umyId = null){
    return {
        type: SET_COMPONENT_SELECTION,
        payload: { umyId: umyId }
    }
}

export function discardComponentSelection(){
    return {
        type: DISCARD_COMPONENT_SELECTION
    }
}

export function showAvailableComponentPreview(index){
    return {
        type: SHOW_AVAILABLE_COMPONENT_PREVIEW,
        payload: { index: index }
    }
}

export function hideAvailableComponentPreview(){
    return {
        type: HIDE_AVAILABLE_COMPONENT_PREVIEW
    }
}

export function setFocusedQuickOptionPath(pathInProps){
    return {
        type: SET_FOCUSED_QUICK_OPTION_PATH,
        payload: {
            pathInProps: pathInProps
        }
    }
}

//function saveComponentDefaults(componentName, defaults){
//
//    return (dispatch, getState) => {
//
//        fetch('/invoke', {
//            method: 'post',
//            headers: {
//                'Accept': 'application/json',
//                'Content-Type': 'application/json; charset=utf-8'
//            },
//            body: JSON.stringify({
//                methodName: 'saveComponentDefaults',
//                data: {
//                    componentName: componentName,
//                    componentOptions: defaults[0]
//                }
//            })
//        });
//    }
//}

export function setAvailableComponentDefaultIndex(index){
    return {
        type: SET_AVAILABLE_COMPONENT_DEFAULT_INDEX,
        payload: { index: index }
    }
}

export function deleteAvailableComponentPreviewIndex(){
    return (dispatch, getState) => {
        //state.defaultsIndexMap[state.selectedAvailableComponentName]
        const { deskPage: { defaultsIndexMap, selectedAvailableComponentName } } = getState();
        let index = defaultsIndexMap[selectedAvailableComponentName];
        dispatch(
            ServerActions.invoke('deleteComponentDefaultsByIndex',
                {componentName: selectedAvailableComponentName, defaultsIndex: index},
                [DELETE_AVAILABLE_COMPONENT_PREVIEW_INDEX]
            )
        );
    }
}

export function switchPageToIndex(index, hasToReloadPageModel = true){
    return {
        type: SWITCH_PAGE_TO_INDEX,
        payload: { index: index, hasToReloadPageModel: hasToReloadPageModel }
    }
}

export function switchPageToPath(pagePath, hasToReloadPageModel = false){
    return {
        type: SWITCH_PAGE_TO_PATH,
        payload: { pagePath: pagePath, hasToReloadPageModel: hasToReloadPageModel }
    }
}

export function commandReloadPage(){
    return {
        type: COMMAND_RELOAD_PAGE,
        payload: {}
    }
}

export function changeModelNodeOptions(newOptions){
    return {
        type: CHANGE_MODEL_NODE_OPTIONS,
        payload: { newOptions: newOptions }
    }
}

export function rewriteModelNode(modelNodeObj){
    return {
        type: REWRITE_MODEL_NODE,
        payload: { options: modelNodeObj }
    }
}

export function deleteModelNodeOptionByPath(optionPath){
    return {
        type: DELETE_MODEL_NODE_OPTION_BY_PATH,
        payload: {
            optionPath: optionPath
        }
    }
}

export function deleteInModelSelected(){
    return {
        type: DELETE_IN_MODEL_SELECTED
    }
}

export function pasteInModelFromClipboard(pasteMode){
    return {
        type: PASTE_IN_MODEL_FROM_CLIPBOARD,
        payload: { pasteMode: pasteMode }
    }
}

export function discardClipboard(){
    return {
        type: DISCARD_CLIPBOARD
    }
}

export function undoModel(){
    return {
        type: UNDO_MODEL
    }
}

export function moveInModelSelected(direction){
    return {
        type: MOVE_IN_MODEL_SELECTED,
        payload: { direction: direction }
    }
}

export function copySelectedInClipboard(){
    return {
        type: COPY_SELECTED_IN_CLIPBOARD
    }
}

export function cutSelectedInClipboard(){
    return {
        type: CUT_SELECTED_IN_CLIPBOARD
    }
}

export function pasteDeleteInModelFromClipboard(pasteMode){
    return {
        type: PASTE_DELETE_IN_MODEL_FROM_CLIPBOARD,
        payload: { pasteMode: pasteMode }
    }
}

export function duplicateInModelSelected(){
    return {
        type: DUPLICATE_IN_MODEL_SELECTED
    }
}

export function startQuickPasteInModelByName(pasteMode){
    return {
        type: START_QUICK_PASTE_IN_MODEL_BY_NAME,
        payload: { pasteMode: pasteMode }
    };
}

export function stopQuickPasteInModelByName(){
    return {
        type: STOP_QUICK_PASTE_IN_MODEL_BY_NAME
    };
}

export function quickPasteInModelByName(componentName, pasteMode){
    return (dispatch, getState) => {
        dispatch(
            ServerActions.invoke(
                'loadComponentDefaults',
                {componentName: componentName},
                [QUICK_PASTE_IN_MODEL_BY_NAME],
                {
                    componentName: componentName,
                    pasteMode: pasteMode
                },
                true
            )
        );
    }
}

export function addNewPage(){
    return {
        type: ADD_NEW_PAGE
    }
}

export function copyCurrentPage(){
    return {
        type: COPY_CURRENT_PAGE
    }
}

export function deleteCurrentPage(){
    return {
        type: DELETE_CURRENT_PAGE
    }
}

export function changeCurrentPageInfo(pageName, pagePath, pageTitle, makeIndexRoute, pageProps, pageScript){
    return {
        type: CHANGE_CURRENT_PAGE_INFO,
        payload: { pageName, pagePath, pageTitle, makeIndexRoute, pageProps, pageScript }
    }
}
