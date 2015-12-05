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

import * as Utils from '../api/utils.js';
import * as UtilStore from '../api/utilStore.js';
import * as ServerActions from './serverActions.js';
import * as DeskPageActions from './deskPageActions.js';
import * as ModalComponentGeneratorActions from './modalComponentGeneratorActions.js';

export const SHOW_MODAL_COMPONENT_EDITOR = 'SHOW_MODAL_COMPONENT_EDITOR';
export const HIDE_MODAL_COMPONENT_EDITOR = 'HIDE_MODAL_COMPONENT_EDITOR';
export const SET_COMPONENT_DOCUMENT = 'SET_COMPONENT_DOCUMENT';
export const SET_COMPONENT_SOURCE_CODE = 'SET_COMPONENT_SOURCE_CODE';

export function showModalComponentEditor(){
    return (dispatch, getState) => {
        let searchResult = getState()['deskPage']['searchResult'];
        let componentsTree = getState()['deskPage']['componentsTree'];
        if(searchResult){
            let component = Utils.fulex(searchResult.found);
            let componentObjectValue = UtilStore.getComponentFromTree(componentsTree, component.type);
            dispatch({
                type: SHOW_MODAL_COMPONENT_EDITOR,
                payload:{
                    component: component,
                    componentObjectValue: componentObjectValue
                }
            });
            dispatch(
                ServerActions.invoke('readComponentDocument',
                    {componentName: component.type},
                    [SET_COMPONENT_DOCUMENT],
                    null,
                    true
                )
            );
            if(componentObjectValue.value && componentObjectValue.value.absoluteSource){
                dispatch(
                    ServerActions.invoke('readComponentCode',
                        {filePath: componentObjectValue.value.absoluteSource},
                        [SET_COMPONENT_SOURCE_CODE],
                        null,
                        true
                    )
                );
            } else {
                dispatch(ServerActions.transferDataToAction(SET_COMPONENT_SOURCE_CODE));
                //dispatch(ServerActions.setServerMessage('Component ' + component.type + ' was not found in component list.'));
            }
        } else {
            dispatch(ServerActions.setServerMessage('Component is not selected.'));
        }
    }
}

export function hideModalComponentEditor(){
    return {
        type: HIDE_MODAL_COMPONENT_EDITOR
    }
}

export function saveComponentOptions(options){
    return (dispatch, getState) => {
        const { propsScript, componentText, sourceCode, componentName, sourceFilePath } = options;
        let validOptions = {};
        try{
            validOptions.props = JSON.parse(propsScript);
            validOptions.text = componentText;
            if(sourceCode){
                dispatch(
                    ServerActions.invoke('rewriteComponentCode',
                        {
                            filePath: sourceFilePath,
                            sourceCode: sourceCode
                        },
                        [DeskPageActions.REWRITE_MODEL_NODE, HIDE_MODAL_COMPONENT_EDITOR],
                        validOptions,
                        false
                    )
                );
            } else {
                dispatch(DeskPageActions.rewriteModelNode(validOptions));
                dispatch(hideModalComponentEditor());
            }
        } catch(e){
            dispatch(ServerActions.setServerMessage('Error in parsing: ' + e.message));
        }


    }
}

export function startGenerateComponent(){
    return (dispatch, getState) => {
        dispatch(hideModalComponentEditor());
        dispatch(ModalComponentGeneratorActions.showModalComponentGenerator());
    }
}