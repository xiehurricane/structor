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

import _ from 'lodash';
import validator from 'validator';

import * as Utils from '../api/utils.js';
import * as UtilStore from '../api/utilStore.js';
import * as ServerActions from './serverActions.js';
import * as DeskPageActions from './deskPageActions.js';

export const SHOW_MODAL_PAGE_INFO = 'SHOW_MODAL_PAGE_INFO';
export const HIDE_MODAL_PAGE_INFO = 'HIDE_MODAL_PAGE_INFO';

export function showModalPageInfo(){

    return (dispatch, getState) => {
        let { deskPage: { currentPageName, currentPagePath, currentPageIndex, model } } = getState();
        const { pageScript, pageProps, pageTitle } = model.pages[currentPageIndex];
        const pagePropsString = JSON.stringify((pageProps || []), null, '\t');
        dispatch({
            type: SHOW_MODAL_PAGE_INFO,
            payload: {
                pageName: currentPageName,
                pagePath:  currentPagePath,
                pageScript: pageScript,
                pageProps: pagePropsString,
                pageTitle: pageTitle || currentPageName
            }
        });
    }

}

export function hideModalPageInfo(){
    return {
        type: HIDE_MODAL_PAGE_INFO
    }
}

export function saveModalPageInfo(pageName, pagePath, pageTitle, makeIndexRoute, pagePropsString, pageScript){

    return (dispatch, getState) => {

        let errors = [];
        if(!pageName || pageName.length <= 0 || !validator.isAlphanumeric(pageName)){

            errors.push('Please enter alphanumeric value for component name');
        }
        if(!pagePath || pagePath.length <= 0 || pagePath.charAt(0) !== '/'){
            errors.push('Please enter non empty value for route path which starts with \'/\' character');
        }
        let pageProps = [];
        try{
            pageProps = JSON.parse(pagePropsString);
        } catch(e){
            errors.push(e.message);
        }

        if(errors.length <= 0){
            let { deskPage: { componentsTree, model, currentPageIndex } } = getState();
            let testComponent =  UtilStore.getComponentFromTree(componentsTree, pageName);
            if(testComponent.value){
                errors.push('There is already a component with name: ' + pageName);
            }
            let foundPage = model.pages.find( (page, index) => {
                return index !== currentPageIndex && (page.pageName === pageName || page.pagePath === pagePath);
            });
            if(foundPage){
                errors.push('There is already a page with the same path: ' + pagePath + ' or name: ' + pageName);
            }
        }

        if(errors.length > 0){
            errors.forEach( message => {
                dispatch(ServerActions.setServerMessage(message));
            });
        } else {
            // Component name must start from char in upper case
            var firstChar = pageName.charAt(0).toUpperCase();
            pageName = firstChar + pageName.substr(1);
            dispatch(DeskPageActions.changeCurrentPageInfo(pageName, pagePath, pageTitle, makeIndexRoute, pageProps, pageScript));
            dispatch(hideModalPageInfo());
        }

    }

}
