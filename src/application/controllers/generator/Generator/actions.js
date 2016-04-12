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

import { bindActionCreators } from 'redux';
import { graphApi, serverApi } from '../../../api';
import { hideGenerator } from '../../app/AppContainer/actions.js';
//import { started, done } from '../../app/AppSpinner/actions.js';

export const STAGE1 = 'STAGE1';
export const STAGE2 = 'STAGE2';
export const STAGE3 = 'STAGE3';
export const STAGE4 = 'STAGE4';

export const STEP_TO_STAGE = "Generator/STEP_TO_STAGE";
export const LOAD_GENERATORS = "Generator/LOAD_GENERATORS";
export const SET_SELECTED_GENERATOR = "Generator/SET_SELECTED_GENERATOR";
export const PREGENERATE = "Generator/PREGENERATE";

export const stepToStage = (stage) => ({type: STEP_TO_STAGE, payload: stage});
export const loadGenerators = () => ({type: LOAD_GENERATORS});
export const setSelectedGenerator = (generatorData) => ({type: SET_SELECTED_GENERATOR, payload: generatorData});

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

export const hide = () => (dispatch, getState) => {
    dispatch(stepToStage(STAGE1));
    dispatch(hideGenerator());
};

export const containerActions = (dispatch) => bindActionCreators({
    hide, stepToStage
}, dispatch);
