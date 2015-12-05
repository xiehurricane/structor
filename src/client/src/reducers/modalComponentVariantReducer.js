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

import * as Actions from '../actions/modalComponentVariantActions.js';
import * as Utils from '../api/utils.js';

export default function(state = {}, action = {type: 'UNKNOWN'}){

    const { payload } = action;

    switch (action.type){

        case Actions.SHOW_MODAL_COMPONENT_VARIANT: //-------------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.isOpen = true;
                return state;
            })();

        case Actions.HIDE_MODAL_COMPONENT_VARIANT: //-------------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.isOpen = false;
                return state;
            })();

        case Actions.COMPONENT_VARIANT_START_STEP_0: //-----------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.step = 0;

                return state;
            })();

        case Actions.COMPONENT_VARIANT_SUBMIT_STEP_0: //----------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                return state;
            })();

        case Actions.COMPONENT_VARIANT_START_STEP_1: //-----------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.step = 1;
                return state;
            })();

        default:
            return state;

    }

}
