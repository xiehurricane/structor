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
    pages: [],
    currentPageName: null,
    currentPagePath: null,
    reloadPageCounter: 0,
    reloadPageRequest: false,
    isEditModeOn: true,
    isLivePreviewModeOn: false,
    selectedUmyId: null
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if(type === actions.RELOAD_PAGE){
        return Object.assign({}, state, {
            reloadPageCounter: state.reloadPageCounter + 1
        });
    }

    if(type === actions.CHANGE_PAGE_ROUTE){
        return Object.assign({}, state, {
            currentPagePath: payload.pagePath,
            currentPageName: payload.pageName
        });
    }

    if(type === actions.SET_PAGES){
        if(payload && payload.length > 0){
            const currentPath = state.currentPagePath ? state.currentPagePath : payload[0].pagePath;
            const currentName = state.currentPageName ? state.currentPageName : payload[0].pageName;
            return Object.assign({}, state, {
                currentPagePath: currentPath,
                currentPageName: currentName,
                pages: payload
            });
        }
    }

    if(type === actions.SET_EDIT_MODE_ON){
        return Object.assign({}, state, {
            isEditModeOn: true,
            isLivePreviewModeOn: false
        });
    }

    if(type === actions.SET_LIVE_PREVIEW_MODE_ON){
        return Object.assign({}, state, {
            isEditModeOn: false,
            isLivePreviewModeOn: true
        });
    }

    if(type === actions.SET_RELOAD_PAGE_REQUEST){
        return Object.assign({}, state, {
            reloadPageRequest: true
        });
    }

    if(type === actions.EXECUTE_RELOAD_PAGE_REQUEST){
        if(state.reloadPageRequest){
            return Object.assign({}, state, {
                reloadPageCounter: state.reloadPageCounter + 1,
                reloadPageRequest: false
            });
        }
    }

    if(type === actions.SET_SELECTED_UIMY_ID){
        return Object.assign({}, state, {
            selectedUmyId: payload
        });
    }

    return state;
}

