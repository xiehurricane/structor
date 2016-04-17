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
import { coockiesApi } from '../../../api';
import { loadGenerators } from '../Generator/actions.js';
//import { hideGeneratorFrame } from '../../app/AppContainer/actions.js';
//import { started, done } from '../../app/AppSpinner/actions.js';

export const ALL_GROUP_KEY = 'All';

export const SET_GENERATORS = "GeneratorList/SET_GENERATORS";
export const SET_RECENT_GENERATORS = "GeneratorList/SET_RECENT_GENERATORS";
export const SET_FILTER = "GeneratorList/SET_FILTER";
export const SET_SELECTED_TAB = "GeneratorList/SET_SELECTED_TAB";

export const setFilter = (filter) => ({type: SET_FILTER, payload: filter});
export const setFilterByGeneratorKey = (generatorKey) => (dispatch, getState) => {
    if(generatorKey && generatorKey.length > 0){
        let parts = generatorKey.split('.');
        if(parts && parts.length > 2){
            let groupKey = '';
            for(let i = 0; i < parts.length - 1; i++){
                groupKey += parts[i] + '.';
            }
            const filter = {
                groupKey: groupKey.substr(0, groupKey.length - 1),
                groupName: parts[parts.length - 2],
                groupNameBack: null
            };
            dispatch({type: SET_FILTER, payload: filter})
        }
    }
};

export const setGenerators = (generators, recentGenerators) => ({type: SET_GENERATORS, payload: {generators, recentGenerators}});

export const setRecentGenerators = (recentGenerators) => ({type: SET_RECENT_GENERATORS, payload: recentGenerators});

export const setSelectedTab = (tabKey) => ({type: SET_SELECTED_TAB, payload: tabKey});

export const toggleGenerics = () => (dispatch, getState) => {
    const {generator: {loadOptions}} = getState();
    loadOptions.isOnlyGenerics = !loadOptions.isOnlyGenerics;
    dispatch(loadGenerators(loadOptions));
};

export const removeFromRecentGenerators = (generatorId) => (dispatch, getState) => {
    let recentGenerators = coockiesApi.removeFromRecentGenerators(generatorId);
    dispatch(setRecentGenerators(recentGenerators));
};

export const containerActions = (dispatch) => bindActionCreators({
    setFilter, setSelectedTab, toggleGenerics
}, dispatch);
