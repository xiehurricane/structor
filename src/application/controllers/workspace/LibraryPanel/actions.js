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
import { HtmlComponents, previewGraphApi } from '../../../api';
import { updateMarked } from '../DeskPage/actions.js';

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

export const containerActions = (dispatch) => bindActionCreators({
    previewComponent
}, dispatch);
