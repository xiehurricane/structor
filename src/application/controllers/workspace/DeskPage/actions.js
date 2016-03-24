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

import * as appMessageActions from '../../app/AppMessage/actions.js';

export const LOAD_MODEL = "Desk/LOAD_MODEL";
export const RELOAD_PAGE = "Desk/RELOAD_PAGE";
export const LOAD_PAGE = "Desk/LOAD_PAGE";
export const PAGE_LOADED = "Desk/PAGE_LOADED";
export const PAGE_LOAD_TIMEOUT = "Desk/PAGE_LOAD_TIMEOUT";
export const CHANGE_PAGE_ROUTE = "Desk/CHANGE_PAGE_ROUTE";
export const SET_LIVE_PREVIEW_MODE_ON = "Desk/SET_LIVE_PREVIEW_MODE_ON";
export const SET_EDIT_MODE_ON = "Desk/SET_EDIT_MODE_ON";
export const SET_RELOAD_PAGE_REQUEST = "Desk/SET_RELOAD_PAGE_REQUEST";
export const EXECUTE_RELOAD_PAGE_REQUEST = "Desk/EXECUTE_RELOAD_PAGE_REQUEST";
export const COMPILER_START = "Desk/COMPILER_START";
export const COMPILER_DONE = "Desk/COMPILER_DONE";
export const COMPILER_TIMEOUT = "Desk/COMPILER_TIMEOUT";

export const loadModel = (payload) => ({type: LOAD_MODEL, payload});
export const reloadPage = () => ({type: RELOAD_PAGE});
export const loadPage = () => ({type: LOAD_PAGE});
export const pageLoaded = () => ({type: PAGE_LOADED});
export const pageLoadTimeout = () => ({type: PAGE_LOAD_TIMEOUT});
export const changePageRoute = (payload) => ({type: CHANGE_PAGE_ROUTE, payload});
export const setLivePreviewModeOn = () => ({ type: SET_LIVE_PREVIEW_MODE_ON });
export const setEditModeOn = () => ({ type: SET_EDIT_MODE_ON });
export const setReloadPageRequest = () => ({ type: SET_RELOAD_PAGE_REQUEST });
export const executeReloadPageRequest = () => ({ type: EXECUTE_RELOAD_PAGE_REQUEST });
export const compilerStart = () => ({ type: COMPILER_START });
export const compilerDone = () => ({ type: COMPILER_DONE });
export const compilerTimeout = () => ({ type: COMPILER_TIMEOUT });

export const handleCompilerMessage = (message) => (dispatch, getState) => {
    if(message.status === 'start'){
        dispatch(compilerStart());
    } else if(message.status === 'done') {
        if(message.errors && message.errors.length > 0){
            message.errors.forEach( error => {
                dispatch(appMessageActions.failed(String(error)));
            });
            dispatch(setReloadPageRequest());
        } else {
            dispatch(executeReloadPageRequest());
        }
        dispatch(compilerDone());
    }
};