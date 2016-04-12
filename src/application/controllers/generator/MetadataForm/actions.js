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

import { failed } from '../../app/AppMessage/actions.js';
import {generate} from '../Generator/actions.js';

export const SET_SELECTED_GENERATOR = "MetadataForm/SET_SELECTED_GENERATOR";
export const SET_COMPONENT_METADATA = "MetadataForm/SET_COMPONENT_METADATA";

export const setSelectedGenerator = (generatorData) => ({type: SET_SELECTED_GENERATOR, payload: generatorData});
export const startGeneration = (groupName, componentName, metaData) => (dispatch, getState) => {
    try{
        let metaDataObject = JSON.parse(metaData);
        dispatch(generate(groupName, componentName, metaDataObject));
        dispatch({type: SET_COMPONENT_METADATA, payload: {groupName, componentName, metaData: metaDataObject}});
    } catch(e){
        dispatch(failed('Parsing metadata error. ' + e));
    }
};

export const containerActions = (dispatch) => bindActionCreators({
    startGeneration
}, dispatch);