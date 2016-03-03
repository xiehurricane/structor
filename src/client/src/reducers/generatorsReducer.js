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

import * as Actions from '../actions/generatorsActions.js';

export default function(state = {}, action = {type: 'UNKNOWN'}){

    const { payload } = action;

    switch (action.type){

        case Actions.GET_INSTALLED_GENERATORS_LIST: //------------------------------------------------------------------
            return (() => {
                state = Object.assign({}, state);
                state.installed = {
                    list: payload.data || [],
                    filter: state.installed.filter
                };
                return state;
            })();

        case Actions.GET_AVAILABLE_GENERATORS_LIST: //------------------------------------------------------------------
            return (() => {
                state = Object.assign({}, state);
                state.available = {
                    list: payload.data || [],
                    filter: state.available.filter
                };
                return state;
            })();

        case Actions.SET_INSTALLED_FILTER: //---------------------------------------------------------------------------
            return (() => {
                state = Object.assign({}, state);
                state.installed = {
                    list: state.installed.list,
                    filter: payload
                };
                return state;
            })();

        case Actions.SET_AVAILABLE_FILTER: //---------------------------------------------------------------------------
            return (() => {
                state = Object.assign({}, state);
                state.available = {
                    list: state.available.list,
                    filter: payload
                };
                return state;
            })();

        default:
            return state;

    }

}
