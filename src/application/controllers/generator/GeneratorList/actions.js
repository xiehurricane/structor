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
//import { hideGeneratorFrame } from '../../app/AppContainer/actions.js';
//import { started, done } from '../../app/AppSpinner/actions.js';

export const ALL_GROUP_KEY = 'All';

export const SET_GENERATORS = "Generator/SET_GENERATORS";
export const SET_RECENT_GENERATORS = "Generator/SET_RECENT_GENERATORS";
export const SET_FILTER = "Generator/SET_FILTER";
export const SET_SELECTED_TAB = "Generator/SET_SELECTED_TAB";

export const setFilter = (filter) => ({type: SET_FILTER, payload: filter});
export const setGenerators = (generators, recentGenerators) => ({type: SET_GENERATORS, payload: {generators, recentGenerators}});
export const setRecentGenerators = (recentGenerators) => ({type: SET_RECENT_GENERATORS, payload: recentGenerators});
export const setSelectedTab = (tabKey) => ({type: SET_SELECTED_TAB, payload: tabKey});

export const containerActions = (dispatch) => bindActionCreators({
    setFilter, setSelectedTab
}, dispatch);
