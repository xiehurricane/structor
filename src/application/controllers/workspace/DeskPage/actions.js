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
import validator from 'validator';
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
export const SET_SELECTED_UIMY_ID = "DeskPage/SET_SELECTED_UMYID";

//export const loadModel = (payload) => ({type: LOAD_MODEL, payload});
export const setPages = (pages) => ({type: SET_PAGES, payload: pages});
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

export const loadModel = (model) => (dispatch, getState) => {
    let { pages } = model;
    // force to have at least one page
    if (!pages || pages.length <= 0) {
        let pageModel = utilsStore.getTemplatePageModel();
        model.pages = [pageModel];
    }
    graphApi.initGraph(model);
    let pagePathList = [];
    model.pages.forEach(page => {
        pagePathList.push({
            pagePath: page.pagePath,
            pageName: page.pageName
        });
    });
    dispatch({type: SET_PAGES, payload: pagePathList});
};

export const addNewPage = () => (dispatch, getState) => {
    let pageModel = utilsStore.getTemplatePageModel();
    let model = graphApi.getModel();
    pageModel.pageName = pageModel.pageName + model.pages.length;
    pageModel.pagePath = pageModel.pagePath + model.pages.length;
    model.pages.push(pageModel);
    dispatch(loadModel(model));
    dispatch({type: CHANGE_PAGE_ROUTE, payload: { pagePath: pageModel.pagePath, pageName: pageModel.pageName }});
};

export const clonePage = (pagePath) => (dispatch, getState) => {
    let model = graphApi.getModel();
    let modelNode = graphApi.getModelNode(pagePath);
    if(modelNode){
        let newModelNode = utils.fulex(modelNode);
        newModelNode.pageName = modelNode.pageName + '_copy';
        newModelNode.pagePath = modelNode.pagePath + '_copy';
        model.pages.push(newModelNode);
        dispatch(loadModel(model));
        dispatch({type: CHANGE_PAGE_ROUTE, payload:{ pagePath: newModelNode.pagePath, pageName: newModelNode.pageName }});
        dispatch(success('Page is cloned'));
    } else {
        dispatch(failed('Page with path \'' + pagePath + '\' was not found'));
    }
};

export const changePageOptions = (options) => (dispatch, getState) => {

    let {pageName, pagePath, makeIndexRoute, currentPagePath} = options;

    if(!pageName || pageName.length <= 0 || !validator.isAlphanumeric(pageName)){
        dispatch(failed('Please enter alphanumeric value for page component name'));
    } else if(!pagePath || pagePath.length <= 0 || pagePath.charAt(0) !== '/'){
        dispatch(failed('Please enter non empty value for route path which starts with \'/\' character'));
    } else {
        var firstChar = pageName.charAt(0).toUpperCase();
        pageName = firstChar + pageName.substr(1);
        let node = graphApi.getNode(currentPagePath);
        if(node && node.modelNode){
            node.modelNode.pageName = pageName;
            node.modelNode.pagePath = pagePath;
            let model = graphApi.getModel();
            if(makeIndexRoute && model.pages.length > 1){
                console.log('Make index : ' + pagePath + ', index: ' + node.index);
                const tempModel = model.pages.splice(node.index, 1)[0];
                if(tempModel){
                    model.pages.splice(0, 0, tempModel);
                }
            }
            dispatch(loadModel(model));
            dispatch({type: CHANGE_PAGE_ROUTE, payload:{ pagePath, pageName }});
            dispatch(hidePageOptionsModal());
            dispatch(success('Page route is changed successfully.'));
        } else {
            dispatch(failed('Page with path \'' + pagePath + '\' was not found'));
        }
    }
};

export const setSelectedUmyId = (umyId) => (dispatch, getState) => {
    const { deskPage: { selectedUmyId } } = getState();
    if (selectedUmyId) {
        let graphNode = graphApi.getNode(selectedUmyId);
        if (graphNode) {
            graphNode.selected = undefined;
        } else {
            dispatch(failed('Currently selected component with id \'' + selectedUmyId + '\' was not found'));
        }
    }
    if(selectedUmyId !== umyId){
        let nextGraphNode = graphApi.getNode(umyId);
        if(nextGraphNode){
            nextGraphNode.selected = true;
            dispatch({type: SET_SELECTED_UIMY_ID, payload: umyId});
        } else {
            dispatch(failed('The next to select component with id \'' + selectedUmyId + '\' was not found'));
        }
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

export const containerActions = (dispatch) => bindActionCreators({loadPage, pageLoaded, setSelectedUmyId}, dispatch);
