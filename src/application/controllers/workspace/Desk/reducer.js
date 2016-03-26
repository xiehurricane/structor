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
    iframeWidth: '100%',
    isAvailableComponentsActive: false,
    isPageTreeviewActive: false,
    isQuickOptionsActive: false
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if(type === actions.CHANGE_VIEWPORT_WIDTH){
        return Object.assign({}, state, {
            iframeWidth: payload
        });
    }

    if(type === actions.TOGGLE_AVAILABLE_COMPONENTS){
        return Object.assign({}, state, { isAvailableComponentsActive: !state.isAvailableComponentsActive });
    }

    if(type === actions.TOGGLE_PAGE_TREEVIEW){
        return Object.assign({}, state, { isPageTreeviewActive: !state.isPageTreeviewActive });
    }

    if(type === actions.TOGGLE_QUICK_OPTIONS){
        return Object.assign({}, state, { isQuickOptionsActive: !state.isQuickOptionsActive });
    }

    return state;
}

