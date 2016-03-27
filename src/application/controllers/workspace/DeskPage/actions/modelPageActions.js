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
import { utils, utilsStore, graphApi } from '../../../../api';
import { success, failed, timeout, close} from '../../../app/AppMessage/actions.js';
import { hideModal as hidePageOptionsModal } from '../../PageOptionsModal/actions.js';
import { setPages, changePageRoute } from '../actions.js';

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
    dispatch(setPages(pagePathList));
};

export const addNewPage = () => (dispatch, getState) => {
    let pageModel = utilsStore.getTemplatePageModel();
    let model = graphApi.getModel();
    pageModel.pageName = pageModel.pageName + model.pages.length;
    pageModel.pagePath = pageModel.pagePath + model.pages.length;
    model.pages.push(pageModel);
    dispatch(loadModel(model));
    dispatch(changePageRoute({ pagePath: pageModel.pagePath, pageName: pageModel.pageName }));
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
        dispatch(changePageRoute({ pagePath: newModelNode.pagePath, pageName: newModelNode.pageName }));
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
            dispatch(changePageRoute({ pagePath, pageName }));
            dispatch(hidePageOptionsModal());
            dispatch(success('Page route is changed successfully.'));
        } else {
            dispatch(failed('Page with path \'' + pagePath + '\' was not found'));
        }
    }
};

