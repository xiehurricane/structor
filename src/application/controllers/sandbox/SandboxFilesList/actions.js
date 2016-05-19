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
import { sandboxGraphApi } from '../../../api';
import { stepToStage, STAGE3 } from '../Sandbox/actions.js';

export const SET_GENERATED_DATA = "SandboxFilesList/SET_GENERATED_DATA";
export const SET_AVAILABLE_TO_PUBLISH = "SandboxFilesList/SET_AVAILABLE_TO_PUBLISH";

export const setGeneratedData = (generatedData) => (dispatch, getState) => {
    if(generatedData.defaultModel){
        sandboxGraphApi.initGraph(generatedData.defaultModel);
    }
    dispatch({type: SET_GENERATED_DATA, payload: generatedData});
};
export const setAvailableToPublish = (flag) => ({type: SET_AVAILABLE_TO_PUBLISH, payload: flag});

export const showGeneratorCard = () => (dispatch, getState) => {
    dispatch(stepToStage(STAGE3));
};

export const containerActions = (dispatch) => bindActionCreators({
    showGeneratorCard
}, dispatch);