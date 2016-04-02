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
    reloadPageRequest: false,
    isEditModeOn: true,
    isLivePreviewModeOn: false,

    reloadPageCounter: 0,
    markedUpdateCounter: 0,
    modelUpdateCounter: 0
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if(type === actions.RELOAD_PAGE){
        return Object.assign({}, state, {
            reloadPageCounter: state.reloadPageCounter + 1
        });
    }

    if(type === actions.CHANGE_PAGE_ROUTE){
        const existingPaths = state.pages.filter(page => page.pagePath === payload );
        if(existingPaths && existingPaths.length > 0){
            return Object.assign({}, state, {
                currentPagePath: existingPaths[0].pagePath,
                currentPageName: existingPaths[0].pageName
            });
        }
    }

    if(type === actions.CHANGE_PAGE_ROUTE_FEEDBACK){
        const existingPaths = state.pages.filter(page => page.pagePath === payload );
        if(existingPaths && existingPaths.length > 0){
            return Object.assign({}, state, {
                currentPagePath: existingPaths[0].pagePath,
                currentPageName: existingPaths[0].pageName
            });
        }
    }

    if(type === actions.SET_PAGES){
        if(payload && payload.length > 0){
            return Object.assign({}, state, {
                pages: payload
            });
        }
    }

    if(type === actions.SET_EDIT_MODE_ON){
        return Object.assign({}, state, {
            isEditModeOn: true,
            isLivePreviewModeOn: false,
            modelUpdateCounter: state.modelUpdateCounter + 1
        });
    }

    if(type === actions.SET_LIVE_PREVIEW_MODE_ON){
        return Object.assign({}, state, {
            isEditModeOn: false,
            isLivePreviewModeOn: true,
            modelUpdateCounter: state.modelUpdateCounter + 1
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

    if(type === actions.UPDATE_MARKED){
        return Object.assign({}, state, {
            markedUpdateCounter: state.markedUpdateCounter + 1
        });
    }

    if(type === actions.UPDATE_PAGE){
        return Object.assign({}, state, {
            modelUpdateCounter: state.modelUpdateCounter + 1
        });
    }

    return state;
}

