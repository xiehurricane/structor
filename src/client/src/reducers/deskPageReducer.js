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
import HtmlComponents from '../api/HtmlComponents.js';
import * as Actions from '../actions/deskPageActions.js';
import { getSortedHtmlComponents } from '../api/HtmlComponents.js';
import * as Utils from '../api/utils.js';
import * as UtilStore from '../api/utilStore.js';

function discardClipboard(state) {
    state.clipboard = null;
    state.inClipboard = null;
    state.clipboardMode = 'EMPTY_MODE';
    state.selectedAvailableComponentName = null;
    state.selectedAvailableComponentDefaults = null;
    if(state.selectedUmyIdToCopy){
        state.model = Utils.removeClassNameFromNode('umy-grid-basic-border-copy', state.model, state.selectedUmyIdToCopy);
        state.selectedUmyIdToCopy = null;
        state.modelChangeCounter++;
    }
    if(state.selectedUmyIdToCut){
        state.model = Utils.removeClassNameFromNode('umy-grid-basic-border-cut', state.model, state.selectedUmyIdToCut);
        state.selectedUmyIdToCut = null;
        state.modelChangeCounter++;
    }
    return state;
}

function isClipboardEmpty(state){
    const { clipboard, inClipboard, clipboardMode, selectedAvailableComponentName,
        selectedAvailableComponentDefaults, selectedUmyIdToCopy, selectedUmyIdToCut } = state;
    return ( !clipboard && !inClipboard && clipboardMode === 'EMPTY_MODE' & selectedAvailableComponentName &
            selectedAvailableComponentDefaults & selectedUmyIdToCopy & selectedUmyIdToCut );
}

export default function (state = {}, action = {type: 'UNKNOWN'}) {

    const { payload } = action;

    switch (action.type) {

        case Actions.SET_COMPONENT_SELECTION: //------------------------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                state.selectedUmyId = payload.umyId || state.selectedUmyId;
                if (state.selectedUmyId) {
                    state.searchResult = Utils.findByUmyId(state.model, state.selectedUmyId);
                    state.isDomNodeInCurrentPage = UtilStore.hasPageDomNode(state.selectedUmyId);
                    state.isSelectedUmyIdInCurrentPage = state.searchResult.pageIndex === state.currentPageIndex;
                }
                state.selectComponentCounter++;
                //console.log('Component refresh selection: ' + state.selectedUmyId);
                return state;
            })();

        case Actions.DISCARD_COMPONENT_SELECTION: //--------------------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                state.selectedUmyId = null;
                state.searchResult = null;
                state.isDomNodeInCurrentPage = false;
                state.isSelectedUmyIdInCurrentPage = false;
                state.selectComponentCounter++;
                return state;
            })();

        case Actions.SHOW_AVAILABLE_COMPONENT_PREVIEW: //---------------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                let index = parseInt(payload.index);
                if (state.selectedAvailableComponentDefaults
                    && state.selectedAvailableComponentDefaults.length > index
                    && index >= 0) {
                    if (state.selectedAvailableComponentDefaults && state.selectedAvailableComponentName) {
                        state.defaultsIndexMap[state.selectedAvailableComponentName] = index;
                        state.clipboard = state.selectedAvailableComponentDefaults[index];
                    }
                    let componentModel = state.selectedAvailableComponentDefaults[index];
                    let label = componentModel.variantName ? componentModel.variantName : ('Variant #' + index);
                    let pageModel = Utils.fulex(UtilStore.templatePreviewPageModel);
                    pageModel.children[0].children[0].children[0].text = state.selectedAvailableComponentName + ': ' + label;
                    pageModel.children[0].children.push(componentModel);
                    state.previewModel = pageModel;
                    state.previewComponentCounter++;
                }
                return state;
            })();

        case Actions.DISCARD_CLIPBOARD: //------------------------------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                state = discardClipboard(state);
                return state;
            })();

        case Actions.HIDE_AVAILABLE_COMPONENT_PREVIEW: //---------------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                state.previewModel = null;
                state.previewComponentCounter++;
                return state;
            })();

        case Actions.SET_AVAILABLE_COMPONENT_DEFAULT_INDEX: //----------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                let index = parseInt(payload.index);
                if (state.selectedAvailableComponentDefaults && state.selectedAvailableComponentName) {
                    if (index >= 0 && index < state.selectedAvailableComponentDefaults.length) {
                        //console.log('Set available component default index: ' + index);
                        state.defaultsIndexMap[state.selectedAvailableComponentName] = index;
                    }
                    state.clipboard = state.selectedAvailableComponentDefaults[index];
                    state.previewModel = null;
                    state.previewComponentCounter++;
                }
                return state;
            })();

        case Actions.SET_FOCUSED_QUICK_OPTION_PATH: //------------------------------------------------------------------

            return (() => {
                state = Object.assign({}, state, {
                    quickOptions: {
                        focusedPathInProps: payload.pathInProps
                    }
                });
                return state;
            })();

        case Actions.SWITCH_PAGE_TO_INDEX: //---------------------------------------------------------------------------

            return (() => {
                if (payload.index >= 0 && payload.index < state.model.pages.length) {
                    state = Utils.fulex(state);
                    state.currentPageName = state.model.pages[payload.index].pageName;
                    state.currentPagePath = state.model.pages[payload.index].pagePath;
                    state.currentPageIndex = parseInt(payload.index);
                    if(payload.hasToReloadPageModel){
                        state.reloadPageModelCounter++;
                    }
                }
                return state;
            })();

        case Actions.SWITCH_PAGE_TO_PATH: //----------------------------------------------------------------------------

            return (() => {
                if (state.model.pages.length > 0 && state.currentPagePath !== payload.pagePath) {
                    let pageIndex = -1;
                    let found = state.model.pages.find((page, index) => {
                        if (page.pagePath === payload.pagePath) {
                            pageIndex = index;
                            return true;
                        }
                    });
                    if (found) {
                        state = Object.assign({}, state, {
                            currentPageName: found.pageName,
                            currentPagePath: found.pagePath,
                            currentPageIndex: pageIndex
                        });
                    } else {
                        // if page is not found go to first page - index route, as React Router does...
                        state = Object.assign({}, state, {
                            currentPageName: state.model.pages[0].pageName,
                            currentPagePath: state.model.pages[0].pagePath,
                            currentPageIndex: 0
                        });
                    }
                    if(payload.hasToReloadPageModel){
                        state.reloadPageModelCounter++;
                    }
                }
                return state;
            })();

        case Actions.COMMAND_RELOAD_PAGE: //----------------------------------------------------------------------------

            return (() => {
                return Object.assign({}, state, {reloadPageCounter: state.reloadPageCounter + 1});
            })();

        case Actions.UNDO_MODEL: //-------------------------------------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                let model = UtilStore.popUndoState();
                if (model) {
                    if(state.currentPageIndex >= model.pages.length){
                        state.currentPageIndex = model.pages.length - 1;
                    }
                    let pagePathsDiffCount = 0;
                    const oldModel = state.model;
                    model.pages.forEach( (page, index) => {
                        if(index < oldModel.pages.length){
                            let oldPagePath = oldModel.pages[index].pagePath;
                            let newPagePath = page.pagePath;
                            if(oldPagePath !== newPagePath){
                                pagePathsDiffCount++;
                            }
                        } else {
                            pagePathsDiffCount++;
                        }
                        if(state.currentPageIndex === index){
                            state.currentPageName = page.pageName;
                            state.currentPagePath = page.pagePath;
                        }
                    });

                    if(pagePathsDiffCount > 0 || model.pages.length !== oldModel.pages.length){
                        state.reloadPageCounter++;
                    }
                    state.model = model;
                    state = discardClipboard(state);
                    state.modelChangeCounter++;
                    state.selectedUmyId = null;
                    state.searchResult = null;
                    state.isDomNodeInCurrentPage = false;
                    state.isSelectedUmyIdInCurrentPage = false;
                    state.selectComponentCounter++;
                }
                return state;
            })();

        case Actions.CHANGE_MODEL_NODE_OPTIONS: //----------------------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                state.model = Utils.mergeNodeOptionsIntoModel(payload.newOptions, state.model, state.selectedUmyId);
                state.searchResult = Utils.findByUmyId(state.model, state.selectedUmyId);
                state.modelChangeCounter++;
                return state;
            })();

        case Actions.REWRITE_MODEL_NODE: //---------------------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                let searchResult = Utils.findByUmyId(state.model, state.selectedUmyId);
                if(searchResult){
                    searchResult.found.type = payload.options.type || searchResult.found.type;
                    searchResult.found.children = payload.options.children || searchResult.found.children;

                    searchResult.found.props = payload.options.props || searchResult.found.props;
                    _.forOwn(searchResult.found.props, (value, prop) => {
                        if(value && _.isObject(value) && value.type){
                            Utils.setupPropsUmyId(value);
                        }
                    });

                    searchResult.found.text = payload.options.text || searchResult.found.text;
                    searchResult.found.props['data-umyid'] = state.selectedUmyId;
                }
                state.modelChangeCounter++;
                return state;
            })();

        case Actions.DELETE_MODEL_NODE_OPTION_BY_PATH: //---------------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                state.searchResult = Utils.findByUmyId(state.model, state.selectedUmyId);
                state.searchResult.found.props = Utils.cleanex(
                    Utils.delex(state.searchResult.found.props, payload.optionPath)
                );
                state.modelChangeCounter++;
                return state;
            })();

        case Actions.PASTE_IN_MODEL_FROM_CLIPBOARD: //------------------------------------------------------------------

            return (() => {
                if(state.selectedUmyId && !isClipboardEmpty(state)){
                    state = Utils.fulex(state);
                    let result = Utils.pasteInModelFromClipboard(
                        state.clipboard, state.selectedUmyId, state.model, payload.pasteMode
                    );
                    state.selectedUmyId = result.selectedUmyId;
                    state.selectComponentCounter++;
                    state.model = result.projectModel;
                    state.modelChangeCounter++;
                }
                return state;
            })();

        case Actions.DELETE_IN_MODEL_SELECTED: //-----------------------------------------------------------------------

            return (() => {
                if(state.selectedUmyId){
                    state = Utils.fulex(state);
                    const resultObj = Utils.deleteFromModel(state.model, state.selectedUmyId);
                    state.selectedUmyId = resultObj.selectedUmyId;
                    state.selectComponentCounter++;
                    state.model = resultObj.projectModel;
                    state.modelChangeCounter++;
                }
                return state;
            })();

        case Actions.MOVE_IN_MODEL_SELECTED: //-------------------------------------------------------------------------

            return (() => {
                if(state.selectedUmyId){
                    state = Utils.fulex(state);
                    if (payload.direction === 'UP') {
                        state.model = Utils.moveUpInModel(state.model, state.selectedUmyId);
                    } else if (payload.direction === 'DOWN') {
                        state.model = Utils.moveDownInModel(state.model, state.selectedUmyId);
                    }
                    state.selectComponentCounter++;
                    state.modelChangeCounter++;
                }
                return state;
            })();

        case Actions.COPY_SELECTED_IN_CLIPBOARD: //---------------------------------------------------------------------

            return (() => {
                if(state.selectedUmyId){
                    state = Utils.fulex(state);
                    state = discardClipboard(state);
                    const buffer = Utils.fulex(state.searchResult.found);
                    state.clipboard = buffer;
                    state.inClipboard = buffer.type;
                    state.clipboardMode = 'COPY_MODE';
                    state.selectedUmyIdToCopy = state.selectedUmyId;
                    state.model = Utils.addClassNameToNode('umy-grid-basic-border-copy', state.model, state.selectedUmyIdToCopy);
                    state.modelChangeCounter++;
                }
                return state;
            })();

        case Actions.CUT_SELECTED_IN_CLIPBOARD: //----------------------------------------------------------------------

            return (() => {
                if(state.selectedUmyId){
                    state = Utils.fulex(state);
                    state = discardClipboard(state);
                    const buffer = Utils.fulex(state.searchResult.found);
                    state.clipboard = buffer;
                    state.inClipboard = buffer.type;
                    state.clipboardMode = 'CUT_MODE';
                    state.selectedUmyIdToCut = state.selectedUmyId;
                    state.model = Utils.addClassNameToNode('umy-grid-basic-border-cut', state.model, state.selectedUmyIdToCut);
                    state.modelChangeCounter++;

                }
                return state;
            })();

        case Actions.PASTE_DELETE_IN_MODEL_FROM_CLIPBOARD: //-----------------------------------------------------------

            return (() => {
                if (state.selectedUmyId && !isClipboardEmpty(state)) {
                    state = Utils.fulex(state);
                    let result = Utils.pasteInModelFromClipboard(
                        state.clipboard, state.selectedUmyId, state.model, payload.pasteMode
                    );
                    let resultObj = Utils.deleteFromModel(result.projectModel, state.selectedUmyIdToCut);
                    state.selectedUmyIdToCut = null;
                    state = discardClipboard(state);
                    state.selectedUmyId = result.selectedUmyId;
                    state.selectComponentCounter++;
                    state.model = resultObj.projectModel;
                    state.modelChangeCounter++;
                }
                return state;
            })();

        case Actions.DUPLICATE_IN_MODEL_SELECTED: //--------------------------------------------------------------------

            return (() => {
                if (state.selectedUmyId) {
                    state = Utils.fulex(state);
                    state = discardClipboard(state);
                    let result = Utils.pasteInModelFromUmyId(
                        state.selectedUmyId, state.selectedUmyId, state.model, 'addAfter'
                    );
                    state.selectedUmyId = result.selectedUmyId;
                    state.selectComponentCounter++;
                    state.model = result.projectModel;
                    state.modelChangeCounter++;
                }
                return state;
            })();

        case Actions.ADD_NEW_PAGE: //-----------------------------------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                let pageModel = UtilStore.getTemplatePageModel();
                pageModel.pageName = pageModel.pageName + state.model.pages.length;
                pageModel.pagePath = pageModel.pagePath + state.model.pages.length;
                Utils.setupPropsUmyId(pageModel, true);
                state.model.pages.push(pageModel);
                state.currentPageName = pageModel.pageName;
                state.currentPagePath = pageModel.pagePath;
                state.currentPageIndex = state.model.pages.length - 1;
                state.reloadPageCounter++;
                return state;
            })();

        case Actions.COPY_CURRENT_PAGE: //------------------------------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                let pageModel = Utils.fulex(state.model.pages[state.currentPageIndex]);
                pageModel.pageName = pageModel.pageName + '_copy';
                pageModel.pagePath = pageModel.pagePath + '_copy';
                Utils.setupPropsUmyId(pageModel, true);
                state.model.pages.push(pageModel);
                state.currentPageName = pageModel.pageName;
                state.currentPagePath = pageModel.pagePath;
                state.currentPageIndex = state.model.pages.length - 1;
                state.reloadPageCounter++;
                return state;
            })();

        case Actions.DELETE_CURRENT_PAGE: //----------------------------------------------------------------------------

            return (() => {
                if(state.model.pages.length > 1){
                    state = Utils.fulex(state);
                    let newPageIndex = 0;
                    if(state.currentPageIndex > 0){
                        newPageIndex = state.currentPageIndex - 1;
                    }
                    state.model.pages.splice(state.currentPageIndex, 1);
                    state.currentPageIndex = newPageIndex;
                    state.currentPageName = state.model.pages[newPageIndex].pageName;
                    state.currentPagePath = state.model.pages[newPageIndex].pagePath;
                    state.reloadPageCounter++;
                }
                return state;
            })();

        case Actions.CHANGE_CURRENT_PAGE_INFO: //-----------------------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                state.model.pages[state.currentPageIndex].pageName = payload.pageName;
                state.model.pages[state.currentPageIndex].pagePath = payload.pagePath;
                state.model.pages[state.currentPageIndex].pageTitle = payload.pageTitle;
                state.model.pages[state.currentPageIndex].pageProps = payload.pageProps;
                state.model.pages[state.currentPageIndex].pageScript = payload.pageScript;
                console.log('Moving page into index route position: ' + payload.makeIndexRoute);
                if(payload.makeIndexRoute && state.model.pages.length > 1){
                    const tempModel = state.model.pages.splice(state.currentPageIndex, 1)[0];
                    if(tempModel){
                        state.model.pages.splice(0, 0, tempModel);
                        state.currentPageIndex = 0;
                    }
                }
                state.currentPageName = payload.pageName;
                state.currentPagePath = payload.pagePath;
                state.reloadPageCounter++;
                return state;
            })();

        //-- Transferred actions from serverActions --------------------------------------------------------------------

        case Actions.DATA_PROJECT_MODEL: //-----------------------------------------------------------------------------

            return (() => {
                let { data: { model, componentsTree } } = payload;
                // force to have at least one page
                if (!model.pages || model.pages.length <= 0) {
                    let pageModel = UtilStore.getTemplatePageModel();
                    model.pages = [pageModel];
                }
                // backward compatibility
                model.pages.forEach( (page, index) => {
                    if(!page.pagePath){
                        page.pagePath = '/' + page.pageName;
                    }
                    // force uniqueness for umyids
                    Utils.setupPropsUmyId(page, true);
                });
                componentsTree['Html'] = getSortedHtmlComponents();
                // todo: uncomment for cleaning
                // clean model from removed components
                //UtilStore.cleanProjectModel(model, componentsTree);

                let currentPageName = model.pages[0].pageName;
                let currentPagePath = model.pages[0].pagePath;

                state = Object.assign({}, state, {
                    model: model,
                    componentsTree: componentsTree,
                    currentPageName: currentPageName,
                    currentPagePath: currentPagePath,
                    currentPageIndex: 0
                });
                state.modelChangeCounter++;
                state.reloadPageCounter++;
                return state;
            })();

        case Actions.DATA_PROJECT_COMPONENTS_TREE: //-------------------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                state.componentsTree = payload.data.componentsTree;
                state.componentsTree['Html'] = getSortedHtmlComponents();
                state.modelChangeCounter++;
                return state;
            })();


        case Actions.SELECT_AVAILABLE_COMPONENT: //---------------------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                state = discardClipboard(state);
                state.selectedAvailableComponentName = payload.options.componentName;
                if (payload.data && payload.data.length > 0) {
                    state.selectedAvailableComponentDefaults = payload.data;
                } else {

                    let htmlDefaults = HtmlComponents[state.selectedAvailableComponentName];
                    let defaults = [];
                    if (htmlDefaults) {
                        defaults.push({
                            variantName: 'Unsaved variant',
                            type: state.selectedAvailableComponentName,
                            props: htmlDefaults.props,
                            children: htmlDefaults.children,
                            text: htmlDefaults.text
                        });
                    } else {
                        defaults.push({
                            variantName: 'Unsaved variant',
                            type: state.selectedAvailableComponentName
                        });
                    }
                    state.selectedAvailableComponentDefaults = defaults;
                }

                let defaultsIndex = state.defaultsIndexMap[state.selectedAvailableComponentName];
                if (!_.isNumber(defaultsIndex) || defaultsIndex >= state.selectedAvailableComponentDefaults.length) {
                    defaultsIndex = 0;
                    state.defaultsIndexMap[state.selectedAvailableComponentName] = defaultsIndex;
                }
                state.clipboard = state.selectedAvailableComponentDefaults[defaultsIndex];
                // backward compatibility, some defaults does not have type value
                state.clipboard.type = state.selectedAvailableComponentName;
                state.inClipboard = state.selectedAvailableComponentName;
                state.clipboardMode = 'ADD_NEW_MODE';
                if (state.previewModel) {
                    state.previewModel = null;
                    state.previewComponentCounter++;
                }
                return state;
            })();

        case Actions.DELETE_AVAILABLE_COMPONENT_PREVIEW_INDEX: //-------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);

                if (payload.data) {
                    state.selectedAvailableComponentDefaults = payload.data;
                } else {

                    let htmlDefaults = HtmlComponents[state.selectedAvailableComponentName];
                    let defaults = [];
                    if (htmlDefaults) {
                        defaults.push({
                            variantName: 'Unsaved variant',
                            type: state.selectedAvailableComponentName,
                            props: htmlDefaults.props,
                            children: htmlDefaults.children,
                            text: htmlDefaults.text
                        });
                    } else {
                        defaults.push({
                            variantName: 'Unsaved variant',
                            type: state.selectedAvailableComponentName
                        });
                    }
                    state.selectedAvailableComponentDefaults = defaults;
                }

                let index = parseInt(state.defaultsIndexMap[state.selectedAvailableComponentName]);
                if (index >= state.selectedAvailableComponentDefaults.length) {
                    index = 0;
                    state.defaultsIndexMap[state.selectedAvailableComponentName] = index
                }
                if (state.selectedAvailableComponentDefaults.length > index && index >= 0) {
                    state.clipboard = state.selectedAvailableComponentDefaults[index];
                    // backward compatibility, some defaults does not have type value
                    state.clipboard.type = state.selectedAvailableComponentNamecomponentName;
                    let componentModel = state.selectedAvailableComponentDefaults[index];
                    // backward compatibility, some defaults does not have type value
                    componentModel.type = state.selectedAvailableComponentName;
                    let label = componentModel.variantName ? componentModel.variantName : ('Variant #' + index);
                    let pageModel = Utils.fulex(UtilStore.templatePreviewPageModel);
                    pageModel.children[0].children[0].children[0].text = state.selectedAvailableComponentName + ': ' + label;
                    pageModel.children[0].children.push(componentModel);
                    state.previewModel = pageModel;
                    state.previewComponentCounter++;
                }
                return state;
            })();

        case Actions.START_QUICK_PASTE_IN_MODEL_BY_NAME: //-------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.quickPasteModeInModelByName = payload.pasteMode;
                return state;
            })();

        case Actions.STOP_QUICK_PASTE_IN_MODEL_BY_NAME: //--------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.quickPasteModeInModelByName = null;
                return state;
            })();

        case Actions.QUICK_PASTE_IN_MODEL_BY_NAME: //-------------------------------------------------------------------

            return (() => {
                state = Utils.fulex(state);
                const { componentName, pasteMode } = payload.options;
                let defaults = payload.data || [];

                if (defaults.length <= 0) {
                    let htmlDefaults = HtmlComponents[componentName];
                    if (htmlDefaults) {
                        defaults.push({
                            variantName: 'Unsaved variant',
                            type: componentName,
                            props: htmlDefaults.props,
                            children: htmlDefaults.children,
                            text: htmlDefaults.text
                        });
                    } else {
                        defaults.push({
                            type: componentName
                        });
                    }
                }

                let defaultsIndex = state.defaultsIndexMap[componentName];
                if (!_.isNumber(defaultsIndex) || defaultsIndex >= defaults.length) {
                    defaultsIndex = 0;
                }
                let clipboard = defaults[defaultsIndex];
                // backward compatibility, some defaults does not have type value
                clipboard.type = componentName;

                let result = Utils.pasteInModelFromClipboard(
                    clipboard, state.selectedUmyId, state.model, pasteMode
                );
                state.selectedUmyId = result.selectedUmyId;
                state.selectComponentCounter++;
                state.model = result.projectModel;
                state.modelChangeCounter++;
                state.quickPasteModeInModelByName = null;
                return state;
            })();

        default:
            return state;

    }

}
