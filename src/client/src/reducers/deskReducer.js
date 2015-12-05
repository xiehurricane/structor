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

import * as Actions from '../actions/deskActions.js';

export default function(state = {}, action = {type: 'UNKNOWN'}){

    const { payload } = action;

    switch (action.type){

        case Actions.START_EDIT_MODE:
            return Object.assign({}, state, {
                isEditMode: true,
                isLivePreviewMode: false,
                isDocumentMode: false
            });

        case Actions.START_LIVE_PREVIEW_MODE:
            return Object.assign({}, state, {
                isEditMode: false,
                isLivePreviewMode: true,
                isDocumentMode: false,
                isAvailableComponentsButtonActive: false,
                isComponentOptionsButtonActive: false,
                isQuickOptionsButtonActive: false,
                isComponentsHierarchyButtonActive: false
            });

        case Actions.TOGGLE_AVAILABLE_COMPONENTS:
            return Object.assign({}, state, { isAvailableComponentsButtonActive: !state.isAvailableComponentsButtonActive });

        case Actions.TOGGLE_COMPONENTS_HIERARCHY:
            return Object.assign({}, state, { isComponentsHierarchyButtonActive: !state.isComponentsHierarchyButtonActive });

        case Actions.TOGGLE_QUICK_OPTIONS:
            return Object.assign({}, state, { isQuickOptionsButtonActive: !state.isQuickOptionsButtonActive });

        case Actions.CHANGE_FRAME_WIDTH:
            return Object.assign({}, state, { iframeWidth: payload.width });

        default:
            return state;

    }

}
