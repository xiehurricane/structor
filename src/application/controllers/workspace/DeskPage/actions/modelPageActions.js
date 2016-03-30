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
import { utils, utilsStore, graphApi } from '../../../../api';
import { success, failed, timeout, close} from '../../../app/AppMessage/actions.js';
import { hideModal as hidePageOptionsModal } from '../../PageOptionsModal/actions.js';
import { resetClipboardKeys } from '../../ClipboardControls/actions.js';
import { setPages, changePageRoute, resetSelectedKeys } from '../actions.js';

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
        const graphNode = graphApi.getNode(pagePath);
        if(graphNode){
            const currentIndex = graphNode.index;
            let pageList = graphApi.deletePage(pagePath);
            if(pageList){
                dispatch(setPages(pageList));
                if(currentIndex === 0){
                    dispatch(changePageRoute(pageList[0].pagePath));
                } else if(currentIndex > 0){
                    dispatch(changePageRoute(pageList[currentIndex - 1].pagePath));
                }
                dispatch(resetClipboardKeys());
                dispatch(resetSelectedKeys());
                dispatch(success('Route path ' + pagePath + ' were deleted successfully'));
            }
        }
    } catch(e){
        dispatch(failed(e.message ? e.message : e));
    }
};

