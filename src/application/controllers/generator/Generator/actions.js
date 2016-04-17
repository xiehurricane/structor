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

import validator from 'validator';
import { bindActionCreators } from 'redux';
import { graphApi, serverApi } from '../../../api';
import { hideGenerator } from '../../app/AppContainer/actions.js';
//import { started, done } from '../../app/AppSpinner/actions.js';
import { failed } from '../../app/AppMessage/actions.js';

export const STAGE1 = 'STAGE1';
export const STAGE2 = 'STAGE2';
export const STAGE3 = 'STAGE3';
export const STAGE4 = 'STAGE4';

export const STEP_TO_STAGE = "Generator/STEP_TO_STAGE";
export const LOAD_GENERATORS = "Generator/LOAD_GENERATORS";
export const SET_GENERATED_DATA = "Generator/SET_GENERATED_DATA";
export const PREGENERATE = "Generator/PREGENERATE";
export const GENERATE = "Generator/GENERATE";
export const SAVE_GENERATED = "Generator/SAVE_GENERATED";

export const stepToStage = (stage) => ({type: STEP_TO_STAGE, payload: stage});
export const loadGenerators = (options) => (dispatch, getState) => {
    if(!options){
        const {generator: {loadOptions}} = getState();
        options = loadOptions;
    }
    dispatch({type: LOAD_GENERATORS, payload: options});
};
export const setGeneratedData = (generatedData) => ({type: SET_GENERATED_DATA, payload: generatedData});

export const pregenerate = (generatorId, version) => (dispatch, getState) => {
    const { selectionBreadcrumbs: {selectedKeys}} = getState();
    if(selectedKeys && selectedKeys.length === 1){
        const selectedNode = graphApi.getNode(selectedKeys[0]);
        if (selectedNode) {
            const {modelNode} = selectedNode;
            if(modelNode){
                dispatch({type: PREGENERATE, payload:{generatorId, version, modelNode}});
            }
        }
    }
};

export const generate = (groupName, componentName, metaData) => (dispatch, getState) => {

    let canProceed = true;

    var firstChar = componentName.charAt(0).toUpperCase();
    componentName = firstChar + componentName.substr(1);

    if(!groupName || groupName.length <= 0 || !validator.isAlphanumeric(groupName)){
        dispatch(failed('Please enter alphanumeric value for group name'));
        canProceed = false;
    }
    if(!componentName || componentName.length <= 0 || !validator.isAlphanumeric(componentName)){
        dispatch(failed('Please enter alphanumeric value for component name'));
        canProceed = false;
    }
    if(groupName === componentName){
        dispatch(failed('Component name is equal to group name'));
        canProceed = false;
    }
    if(canProceed){
        const {selectionBreadcrumbs, metadataForm, libraryPanel} = getState();
        const {selectedKeys} = selectionBreadcrumbs;
        const {selectedGenerator: {id: generatorId, version}} = metadataForm;
        const {componentsList} = libraryPanel;

        if(selectedKeys && selectedKeys.length === 1){
            if(componentsList && componentsList.indexOf(componentName) >= 0){
                canProceed = confirm('There is a component with the equal name in the current project library.\n\n ' +
                    'All reference to the component will be rewritten along with the source code files.\n');
            }
            if(canProceed){
                const selectedNode = graphApi.getNode(selectedKeys[0]);
                if (selectedNode) {
                    const {modelNode} = selectedNode;
                    if(modelNode){
                        dispatch({type: GENERATE, payload:{generatorId, version, groupName, componentName, modelNode, metaData}});
                    }
                }
            }
        }
    }
};

export const saveGenerated = () => (dispatch, getState) => {
    const {selectionBreadcrumbs: {selectedKeys}} = getState();
    const {generator: {generatedData: {files, dependencies}}} = getState();
    const {metadataForm: {groupName, componentName}} = getState();
    dispatch({type: SAVE_GENERATED, payload: {selectedKey: selectedKeys[0], groupName, componentName, files, dependencies}});
};

export const hide = () => (dispatch, getState) => {
    dispatch(stepToStage(STAGE1));
    dispatch(hideGenerator());
    console.log('Generator is closed');
};

export const containerActions = (dispatch) => bindActionCreators({
    hide, stepToStage
}, dispatch);
