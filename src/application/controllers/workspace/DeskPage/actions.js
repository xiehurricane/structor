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

import validator from 'validator';
import { bindActionCreators } from 'redux';
import { utils, utilsStore, graphApi } from '../../../api';
import { success, failed, timeout, close} from '../../app/AppMessage/actions.js';
import { setForCuttingKeys, setForCopyingKeys, resetClipboardKeys } from '../ClipboardIndicator/actions.js';
import { pasteBefore, pasteAfter, pasteFirst, pasteLast, pasteReplace } from '../ClipboardControls/actions.js';
import { setSelectedKey, resetSelectedKeys } from '../SelectionBreadcrumbs/actions.js';
import { cloneSelected, deleteSelected } from '../SelectionControls/actions.js';
import { loadOptions } from '../ComponentOptionsModal/actions.js';
import { pushHistory } from '../HistoryControls/actions.js';
import { loadComponents, setDefaultVariant, hidePreviewComponent, selectVariant } from '../LibraryPanel/actions.js';
import { quickBefore, quickAfter, quickFirst, quickLast, quickReplace } from '../LibraryPanel/actions.js';

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
export const UPDATE_PAGE = "DeskPage/UPDATE_PAGE";
export const UPDATE_MARKED = "DeskPage/UPDATE_MARKED";
export const SAVE_MODEL = "DeskPage/SAVE_MODEL";

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
export const updatePage = () => ({type: UPDATE_PAGE});
export const updateMarked = () => ({type: UPDATE_MARKED});
export const saveModel = () => ({type: SAVE_MODEL});

export const loadModel = (model) => (dispatch, getState) => {
    let { pages } = model;
    // force to have at least one page
    if (!pages || pages.length <= 0) {
        let pageModel = utilsStore.getTemplatePageModel();
        model.pages = [pageModel];
    }
    graphApi.initGraph(model);
    let pageList = graphApi.getPages();
    dispatch(setPages(pageList));
    dispatch(changePageRoute(pageList[0].pagePath));
};

export const addNewPage = (pageName, pagePath) => (dispatch, getState) => {
    try{
        dispatch(pushHistory());
        let pageModel = utilsStore.getTemplatePageModel();
        let pageList = graphApi.addNewPage(pageModel, pagePath, pageName);
        dispatch(setPages(pageList));
        dispatch(changePageRoute(pageList[pageList.length - 1].pagePath));
        dispatch(success('New page was added successfully'));
    } catch(e){
        dispatch(failed(e.message ? e.message : e));
    }
};

export const clonePage = (pageName, pagePath) => (dispatch, getState) => {
    try{
        dispatch(pushHistory());
        const { deskPage: {currentPagePath} } = getState();
        let pageList = graphApi.duplicatePage(currentPagePath, pagePath, pageName);
        dispatch(setPages(pageList));
        dispatch(changePageRoute(pageList[pageList.length - 1].pagePath));
        dispatch(success('Page was cloned successfully'));
    } catch(e){
        dispatch(failed(e.message ? e.message : e));
    }
};

export const changePageOptions = (pageName, pagePath) => (dispatch, getState) => {

    const { deskPage: {currentPagePath, currentPageName} } = getState();
    try {
        if (pagePath !== currentPagePath || pageName !== currentPageName) {
            dispatch(pushHistory());
            let pageList;
            var firstChar = pageName.charAt(0).toUpperCase();
            pageName = firstChar + pageName.substr(1);
            pageList = graphApi.changePagePathAndName(currentPagePath, pagePath, pageName);
            if (pageList) {
                dispatch(setPages(pageList));
                dispatch(changePageRoute(pagePath));
                dispatch(success('Page options were changed successfully.'));
            }
        }
    } catch (e) {
        dispatch(failed(e.message ? e.message : e));
    }
};

export const setIndexPage = () => (dispatch, getState) => {
    try{
        dispatch(pushHistory());
        const { deskPage: {currentPagePath} } = getState();
        let pageList = graphApi.setIndexPage(currentPagePath);
        if(pageList){
            dispatch(setPages(pageList));
            dispatch(success('Route ' + currentPagePath + ' now is the index route.'));
        }
    } catch(e){
        dispatch(failed(e.message ? e.message : e));
    }
};

export const deletePage = () => (dispatch, getState) => {
    try{
        dispatch(pushHistory());
        const { deskPage: {currentPagePath, currentPageIndex} } = getState();
        let pageList = graphApi.deletePage(currentPagePath);
        if(pageList){
            dispatch(setPages(pageList));
            if(currentPageIndex === 0){
                dispatch(changePageRoute(pageList[0].pagePath));
            } else if(currentPageIndex > 0){
                dispatch(changePageRoute(pageList[currentPageIndex - 1].pagePath));
            }
            dispatch(resetClipboardKeys());
            dispatch(resetSelectedKeys());
            dispatch(success('Route path ' + currentPagePath + ' were deleted successfully'));
        }
    } catch(e){
        dispatch(failed(e.message ? e.message : e));
    }
};

export const resetPages = () => (dispatch, getState) => {
    let pageList = graphApi.getPages();
    dispatch(setPages(pageList));
};

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
            dispatch(loadComponents());
            dispatch(executeReloadPageRequest());
        }
        dispatch(compilerDone());
    }
};

export const containerActions = (dispatch) => bindActionCreators({
    loadPage, pageLoaded, setSelectedKey,
    loadOptions, changePageRouteFeedback,
    setForCuttingKeys, setForCopyingKeys,
    pasteBefore, pasteAfter,
    pasteFirst, pasteLast, pasteReplace,
    cloneSelected, deleteSelected,
    setDefaultVariant, hidePreviewComponent, selectVariant,
    quickBefore, quickAfter, quickFirst, quickLast, quickReplace
}, dispatch);
