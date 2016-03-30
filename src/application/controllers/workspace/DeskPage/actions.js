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
import { utils, utilsStore, graphApi } from '../../../api';
import { success, failed, timeout, close} from '../../app/AppMessage/actions.js';
import { hideModal as hidePageOptionsModal } from '../PageOptionsModal/actions.js';

export const SET_PAGES = "DeskPage/SET_PAGES";
export const RELOAD_PAGE = "DeskPage/RELOAD_PAGE";
export const LOAD_PAGE = "DeskPage/LOAD_PAGE";
export const PAGE_LOADED = "DeskPage/PAGE_LOADED";
export const PAGE_LOAD_TIMEOUT = "DeskPage/PAGE_LOAD_TIMEOUT";
export const CHANGE_PAGE_ROUTE = "DeskPage/CHANGE_PAGE_ROUTE";
export const SET_LIVE_PREVIEW_MODE_ON = "DeskPage/SET_LIVE_PREVIEW_MODE_ON";
export const SET_EDIT_MODE_ON = "DeskPage/SET_EDIT_MODE_ON";
export const SET_RELOAD_PAGE_REQUEST = "DeskPage/SET_RELOAD_PAGE_REQUEST";
export const EXECUTE_RELOAD_PAGE_REQUEST = "DeskPage/EXECUTE_RELOAD_PAGE_REQUEST";
export const COMPILER_START = "DeskPage/COMPILER_START";
export const COMPILER_DONE = "DeskPage/COMPILER_DONE";
export const COMPILER_TIMEOUT = "DeskPage/COMPILER_TIMEOUT";
export const CHANGE_PAGE_ROUTE_FEEDBACK = "DeskPage/CHANGE_PAGE_ROUTE_FEEDBACK";

export const setPages = (pages) => ({type: SET_PAGES, payload: pages});
export const reloadPage = () => ({type: RELOAD_PAGE});
export const loadPage = () => ({type: LOAD_PAGE});
export const pageLoaded = () => ({type: PAGE_LOADED});
export const pageLoadTimeout = () => ({type: PAGE_LOAD_TIMEOUT});
export const changePageRoute = (pagePath) => ({type: CHANGE_PAGE_ROUTE, payload: pagePath});
export const setLivePreviewModeOn = () => ({ type: SET_LIVE_PREVIEW_MODE_ON });
export const setEditModeOn = () => ({ type: SET_EDIT_MODE_ON });
export const setReloadPageRequest = () => ({ type: SET_RELOAD_PAGE_REQUEST });
export const executeReloadPageRequest = () => ({ type: EXECUTE_RELOAD_PAGE_REQUEST });
export const compilerStart = () => ({ type: COMPILER_START });
export const compilerDone = () => ({ type: COMPILER_DONE });
export const compilerTimeout = () => ({ type: COMPILER_TIMEOUT });
export const changePageRouteFeedback = (pagePath) => ({type: CHANGE_PAGE_ROUTE_FEEDBACK, payload: pagePath });

import {
    setSelectedKey, setSelectedParentKey,
    updateSelected, setHighlightSelectedKey,
    resetSelectedKeys, removeSelectedKeys,
    SET_SELECTED_KEY, UPDATE_SELECTED
} from './actions/selectComponents.js';
import {
    loadModel, addNewPage, clonePage, changePageOptions, deletePage
} from './actions/modelPageActions.js';

export {
    setSelectedKey, setSelectedParentKey,
    updateSelected, setHighlightSelectedKey,
    resetSelectedKeys, removeSelectedKeys,
    SET_SELECTED_KEY, UPDATE_SELECTED,
    loadModel, addNewPage, clonePage, changePageOptions, deletePage
}

export const handleCompilerMessage = (message) => (dispatch, getState) => {
    if(message.status === 'start'){
        dispatch(compilerStart());
    } else if(message.status === 'done') {
        if(message.errors && message.errors.length > 0){
            message.errors.forEach( error => {
                dispatch(failed(String(error)));
            });
            dispatch(setReloadPageRequest());
        } else {
            dispatch(executeReloadPageRequest());
        }
        dispatch(compilerDone());
    }
};

export const containerActions = (dispatch) => bindActionCreators({
    loadPage, pageLoaded, setSelectedKey, setSelectedParentKey, changePageRouteFeedback
}, dispatch);
