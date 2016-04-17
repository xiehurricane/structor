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

import {forOwn, template} from 'lodash';
import { bindActionCreators } from 'redux';

import { graphApi } from '../../../api';
import {saveAndGenerateSandboxComponent} from '../Sandbox/actions.js';
import { failed } from '../../app/AppMessage/actions.js';

export const SET_TEMPLATE = "GeneratorTemplateList/SET_TEMPLATE";
export const CHANGE_ACTIVE_TEMPLATE_TEXT = "GeneratorTemplateList/CHANGE_ACTIVE_TEMPLATE_TEXT";
export const CHANGE_METAHELP_TEXT = "GeneratorTemplateList/CHANGE_METAHELP_TEXT";
export const CHANGE_README_TEXT = "GeneratorTemplateList/CHANGE_README_TEXT";
export const CHANGE_METADATA = "GeneratorTemplateList/CHANGE_METADATA";
export const CHANGE_DEPENDENCIES = "GeneratorTemplateList/CHANGE_DEPENDENCIES";

export const setTemplate = (templateObject) => (dispatch, getState) => {
    let { selectionBreadcrumbs: { selectedKeys } } = getState();
    if(selectedKeys && selectedKeys.length > 0){
        let graphNode = graphApi.getNode(selectedKeys[0]);
        if(graphNode && graphNode.modelNode){
            templateObject.model = graphNode.modelNode;
        }
    }
    dispatch({type: SET_TEMPLATE, payload: templateObject});
};
export const changeActiveTemplateText = (nextTemplate, prevTemplate, prevTemplateText) => (
    {type: CHANGE_ACTIVE_TEMPLATE_TEXT, payload: {nextTemplate, prevTemplate, prevTemplateText}}
);
export const changeMetahelpText = (metahelpText) => ({type: CHANGE_METAHELP_TEXT, payload: metahelpText});
export const changeReadmeText = (readmeText) => ({type: CHANGE_README_TEXT, payload: readmeText});

export const changeMetadata = (metadata) => (dispatch, getState) => {
    try{
        const newMetadata = JSON.parse(metadata);
        dispatch({type: CHANGE_METADATA, payload: newMetadata});
    } catch(e){
        dispatch(failed('The metadata has to be a valid JSON object. ' + e));
    }
};

export const changeDependencies = (dependencies) => (dispatch, getState) => {
    try{
        const newDependencies = JSON.parse(dependencies);
        dispatch({type: CHANGE_DEPENDENCIES, payload: newDependencies});
    } catch(e){
        dispatch(failed('The dependencies has to be a valid JSON object. ' + e));
    }
};

export const saveAndGenerate = (options) => (dispatch, getState) => {
    const {activeTemplateText, metadataSource, metahelp, dependenciesSource, readme} = options;
    const {generatorTemplate: {templateObject, activeTemplate}} = getState();
    let newTemplateObject = Object.assign({}, templateObject);

    let canProceed = true;
    try{
        newTemplateObject.dependencies = JSON.parse(dependenciesSource);
    } catch(e){
        dispatch(failed('The dependencies has to be a valid JSON object. ' + e));
        canProceed = false;
    }
    try{
        newTemplateObject.metadata = JSON.parse(metadataSource);
    } catch(e){
        dispatch(failed('The metadata has to be a valid JSON object. ' + e));
        canProceed = false;
    }

    newTemplateObject.templates[activeTemplate] = activeTemplateText;
    forOwn(newTemplateObject.templates, (text, tmpl) => {
        try{
            template(text);
        } catch(e){
            dispatch(failed('Template \'' + tmpl + '\' has a syntax error: ' + e));
            canProceed = false;
        }
    });

    if(canProceed){
        newTemplateObject.metahelp = metahelp;
        newTemplateObject.readme = readme;
        dispatch(setTemplate(newTemplateObject));
        dispatch(saveAndGenerateSandboxComponent(newTemplateObject));
    }
};

export const containerActions = (dispatch) => bindActionCreators({
    changeActiveTemplateText, changeMetahelpText, changeReadmeText,
    changeMetadata, changeDependencies,
    saveAndGenerate
}, dispatch);
