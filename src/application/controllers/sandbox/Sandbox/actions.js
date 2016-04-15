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
import { hideSandbox } from '../../app/AppContainer/actions.js';
//import { failed } from '../../app/AppMessage/actions.js';

export const STAGE1 = 'STAGE1';
export const STAGE2 = 'STAGE2';
export const STAGE3 = 'STAGE3';
export const STAGE4 = 'STAGE4';

export const STEP_TO_STAGE = "Sandbox/STEP_TO_STAGE";
export const LOAD_GENERATOR_SAMPLES = "Sandbox/LOAD_GENERATOR_SAMPLES";
export const SET_GENERATOR_SAMPLE = "Sandbox/SET_GENERATOR_SAMPLE";
export const SAVE_AND_GENERATE_SANDBOX_COMPONENT = "Sandbox/SAVE_AND_GENERATE_SANDBOX_COMPONENT";

export const stepToStage = (stage) => ({type: STEP_TO_STAGE, payload: stage});
export const loadGeneratorSamples = () => ({type: LOAD_GENERATOR_SAMPLES});
export const setGeneratorSample = (sampleId) => (dispatch, getState) => {
    dispatch({type: SET_GENERATOR_SAMPLE, payload: sampleId});
};
export const saveAndGenerateSandboxComponent = (templateObject) => (dispatch, getState) => {
    const {sandbox:{generatorSampleId}} = getState();
    dispatch({type: SAVE_AND_GENERATE_SANDBOX_COMPONENT, payload: {sampleId: generatorSampleId, filesObject: templateObject}});
} ;

export const hide = () => (dispatch, getState) => {
    dispatch(stepToStage(STAGE1));
    dispatch(hideSandbox());
};

export const containerActions = (dispatch) => bindActionCreators({
    hide, stepToStage
}, dispatch);
