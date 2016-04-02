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
import { hideModal as hidePageOptionsModal } from '../PageOptionsModal/actions.js';
import { setForCuttingKeys, setForCopyingKeys, resetClipboardKeys } from '../ClipboardIndicator/actions.js';
import { pasteBefore, pasteAfter, pasteFirst, pasteLast, pasteReplace, pasteWrap } from '../ClipboardControls/actions.js';
import { setSelectedKey, setSelectedParentKey, resetSelectedKeys } from '../SelectionBreadcrumbs/actions.js';

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

export const addNewPage = () => (dispatch, getState) => {
    try{
        let pageModel = utilsStore.getTemplatePageModel();
        let pageList = graphApi.getPages();
        pageList = graphApi.addNewPage(pageModel, pageModel.pagePath + pageList.length, pageModel.pageName + pageList.length);
        dispatch(setPages(pageList));
        dispatch(changePageRoute(pageList[pageList.length - 1].pagePath));
        dispatch(success('New page was added successfully'));
    } catch(e){
        dispatch(failed(e.message ? e.message : e));
    }
};

export const clonePage = (pagePath) => (dispatch, getState) => {
    try{
        let pageList = graphApi.duplicatePage(pagePath);
        dispatch(setPages(pageList));
        dispatch(changePageRoute(pageList[pageList.length - 1].pagePath));
        dispatch(success('Page was cloned successfully'));
    } catch(e){
        dispatch(failed(e.message ? e.message : e));
    }
};

export const changePageOptions = (options) => (dispatch, getState) => {

    let {pageName, pagePath, makeIndexRoute, currentPagePath, currentPageName} = options;

    if(!pageName || pageName.length <= 0 || !validator.isAlphanumeric(pageName)){
        dispatch(failed('Please enter alphanumeric value for page component name'));
    } else if(!pagePath || pagePath.length <= 0 || pagePath.charAt(0) !== '/'){
        dispatch(failed('Please enter non empty value for route path which starts with \'/\' character'));
    } else {
        try{
            let pageList;
            if(pagePath !== currentPagePath || pageName !== currentPageName){
                var firstChar = pageName.charAt(0).toUpperCase();
                pageName = firstChar + pageName.substr(1);
                pageList = graphApi.changePagePathAndName(currentPagePath, pagePath, pageName);
            }
            if(makeIndexRoute){
                pageList = graphApi.setIndexPage(pagePath);
            }
            if(pageList){
                dispatch(setPages(pageList));
                dispatch(changePageRoute(pagePath));
                dispatch(success('Page options were changed successfully'));
            }
            dispatch(hidePageOptionsModal());
        } catch(e){
            dispatch(failed(e.message ? e.message : e));
        }
    }
};

export const deletePage = (pagePath) => (dispatch, getState) => {
    try{
        const { deskPage: {pages} } = getState();
        let pageIndex;
        for(let i = 0; i < pages.length; i++){
            if(pages[i].pagePath === pagePath){
                pageIndex = i;
                break;
            }
        }
        let pageList = graphApi.deletePage(pagePath);
        if(pageList){
            dispatch(setPages(pageList));
            if(pageIndex === 0){
                dispatch(changePageRoute(pageList[0].pagePath));
            } else if(pageIndex > 0){
                dispatch(changePageRoute(pageList[pageIndex - 1].pagePath));
            }
            dispatch(resetClipboardKeys());
            dispatch(resetSelectedKeys());
            dispatch(success('Route path ' + pagePath + ' were deleted successfully'));
        }
    } catch(e){
        dispatch(failed(e.message ? e.message : e));
    }
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
            dispatch(executeReloadPageRequest());
        }
        dispatch(compilerDone());
    }
};

export const containerActions = (dispatch) => bindActionCreators({
    loadPage, pageLoaded, setSelectedKey,
    setSelectedParentKey, changePageRouteFeedback,
    setForCuttingKeys, setForCopyingKeys,
    pasteBefore, pasteAfter,
    pasteFirst, pasteLast, pasteReplace, pasteWrap
}, dispatch);
