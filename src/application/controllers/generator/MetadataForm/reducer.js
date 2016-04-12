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

import * as actions from './actions.js';

const initialState = {
    groupName: undefined,
    componentName: undefined,
    metaData: undefined,
    selectedGenerator: {
        id: undefined,
        version: undefined,
        metaData: undefined,
        metaHelp: undefined
    }
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;


    if(type === actions.SET_COMPONENT_METADATA){
        return Object.assign({}, state, {
            groupName: payload.groupName,
            componentName: payload.componentName,
            metaData: payload.metaData
        });
    }

    if(type === actions.SET_SELECTED_GENERATOR){
        return Object.assign({}, state, {
            selectedGenerator:{
                id: payload.generatorId,
                version: payload.version,
                metaData: payload.metaData,
                metaHelp: payload.metaHelp
            },
            metaData: payload.metaData
        });
    }

    return state;

}


