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
import { HtmlComponents, previewGraphApi, graphApi } from '../../../api';
import { success, failed} from '../../app/AppMessage/actions.js';
import { updateMarked, updatePage } from '../DeskPage/actions.js';
import { setSelectedKey } from '../SelectionBreadcrumbs/actions.js';
import { setForNew } from '../ClipboardIndicator/actions.js';
import { pushHistory } from '../HistoryControls/actions.js';

export const LOAD_COMPONENTS = "LibraryPanel/LOAD_COMPONENTS";
export const SET_COMPONENTS = "LibraryPanel/SET_COMPONENTS";
export const PREVIEW_COMPONENT = "LibraryPanel/PREVIEW_COMPONENT";
export const HIDE_PREVIEW = "LibraryPanel/HIDE_PREVIEW";
export const SET_DEFAULT_VARIANT = "LibraryPanel/SET_DEFAULT_VARIANT";

export const loadComponents = () => ({ type: LOAD_COMPONENTS });

export const previewComponent = (componentName) => (dispatch, getState) => {
    const variants = previewGraphApi.getVariantKeys(componentName);
    dispatch({ type: PREVIEW_COMPONENT, payload: {componentName, variants} });
    dispatch(updateMarked());
};

export const hidePreviewComponent = () => (dispatch, getState) => {
    dispatch({ type: HIDE_PREVIEW });
    dispatch(updateMarked());
};

export const setComponents = (components) => (dispatch, getState) => {
    let {componentsTree, componentDefaultsMap} = components;
    previewGraphApi.initGraph(componentDefaultsMap);

    dispatch({type: SET_COMPONENTS, payload: {componentsTree}});
};

export const setDefaultVariant = (componentName, variant) => (dispatch, getState) => {
    dispatch({type: SET_DEFAULT_VARIANT, payload: {componentName, variant}});
    dispatch(updateMarked());
};

export const selectVariant = (variant) => (dispatch, getState) => {
    const variantModel = previewGraphApi.getModelForVariant(variant);
    if(variantModel){
        dispatch(setForNew(variantModel));
        dispatch(hidePreviewComponent());
    } else {
        console.error('Select variant: model for variant key was not found');
    }
};

export const quickCopyToClipboard = (componentName) => (dispatch, getState) => {
    const { libraryPanel: {defaultVariantMap, componentsList} } = getState();
    if(componentsList && componentsList.indexOf(componentName) >= 0){
        const variantModel = getVariantModel(defaultVariantMap, componentName);
        if(variantModel){
            dispatch(setForNew(variantModel));
            dispatch(success(componentName + ' was copied to clipboard'));
        } else {
            console.error('Quick copy to clipboard: model for variant key was not found');
        }
    } else {
        dispatch(failed('Component ' + componentName + ' was not found.'))
    }
};

export const quickBefore = (componentName) => (dispatch, getState) => {
    const { libraryPanel: {defaultVariantMap, componentsList} } = getState();
    if(componentsList && componentsList.indexOf(componentName) >= 0){
        const variantModel = getVariantModel(defaultVariantMap, componentName);
        if(variantModel){
            dispatch(pushHistory());
            const newSelectedKey = graphApi.quickBeforeOrAfter(variantModel, false);
            dispatch(setSelectedKey(newSelectedKey));
            dispatch(updatePage());
        } else {
            console.error('Quick add before: model for variant key was not found');
        }
    } else {
        dispatch(failed('Component ' + componentName + ' was not found.'))
    }
};

export const quickAfter = (componentName) => (dispatch, getState) => {
    const { libraryPanel: {defaultVariantMap, componentsList} } = getState();
    if(componentsList && componentsList.indexOf(componentName) >= 0){
        const variantModel = getVariantModel(defaultVariantMap, componentName);
        if(variantModel){
            dispatch(pushHistory());
            const newSelectedKey = graphApi.quickBeforeOrAfter(variantModel, true);
            dispatch(setSelectedKey(newSelectedKey));
            dispatch(updatePage());
        } else {
            console.error('Quick add after: model for variant key was not found');
        }
    } else {
        dispatch(failed('Component ' + componentName + ' was not found.'))
    }
};

export const quickFirst = (componentName) => (dispatch, getState) => {
    const { libraryPanel: {defaultVariantMap, componentsList} } = getState();
    if(componentsList && componentsList.indexOf(componentName) >= 0){
        const variantModel = getVariantModel(defaultVariantMap, componentName);
        if(variantModel){
            dispatch(pushHistory());
            const newSelectedKey = graphApi.quickFirstOrLast(variantModel, true);
            dispatch(setSelectedKey(newSelectedKey));
            dispatch(updatePage());
        } else {
            console.error('Quick add as first: model for variant key was not found');
        }
    } else {
        dispatch(failed('Component ' + componentName + ' was not found.'))
    }
};

export const quickLast = (componentName) => (dispatch, getState) => {
    const { libraryPanel: {defaultVariantMap, componentsList} } = getState();
    if(componentsList && componentsList.indexOf(componentName) >= 0){
        const variantModel = getVariantModel(defaultVariantMap, componentName);
        if(variantModel){
            dispatch(pushHistory());
            const newSelectedKey = graphApi.quickFirstOrLast(variantModel, false);
            dispatch(setSelectedKey(newSelectedKey));
            dispatch(updatePage());
        } else {
            console.error('Quick add as first: model for variant key was not found');
        }
    } else {
        dispatch(failed('Component ' + componentName + ' was not found.'))
    }
};

export const quickReplace = (componentName) => (dispatch, getState) => {
    const { libraryPanel: {defaultVariantMap, componentsList} } = getState();
    if(componentsList && componentsList.indexOf(componentName) >= 0){
        const variantModel = getVariantModel(defaultVariantMap, componentName);
        if(variantModel){
            dispatch(pushHistory());
            const newSelectedKey = graphApi.quickReplace(variantModel);
            dispatch(setSelectedKey(newSelectedKey));
            dispatch(updatePage());
        } else {
            console.error('Quick replace: model for variant key was not found');
        }
    } else {
        dispatch(failed('Component ' + componentName + ' was not found.'))
    }
};

//export const quickWrap = (componentName, selectedKey) => (dispatch, getState) => {
//    const { libraryPanel: {defaultVariantMap, componentsList} } = getState();
//    if(componentsList && componentsList.indexOf(componentName) >= 0){
//        const variantModel = getVariantModel(defaultVariantMap, componentName);
//        if(variantModel){
//            dispatch(pushHistory());
//            const newSelectedKey = graphApi.quickWrap(variantModel, selectedKey);
//            dispatch(setSelectedKey(newSelectedKey));
//            dispatch(updatePage());
//        } else {
//            console.error('Quick wrap: model for variant key was not found');
//        }
//    } else {
//        dispatch(failed('Component ' + componentName + ' was not found.'))
//    }
//};

export const containerActions = (dispatch) => bindActionCreators({
    previewComponent, quickCopyToClipboard
}, dispatch);

function getVariantModel(defaultVariantMap, componentName){
    let defaultVariant = defaultVariantMap[componentName];
    let variantKey;
    if(defaultVariant && defaultVariant.key){
        variantKey = defaultVariant.key;
    } else {
        const variants = previewGraphApi.getVariantKeys(componentName);
        if(variants && variants.length > 0){
            variantKey = variants[0];
        } else {
            console.error('Quick add before: none of model variants is found for ' + componentName);
        }
    }
    return previewGraphApi.getModelForVariant(variantKey);
}