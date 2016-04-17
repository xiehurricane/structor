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

import * as actions from './actions.js';

const initialState = {
    templateObject: {},
    activeTemplate: 'component'
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if(type === actions.SET_TEMPLATE){
        return Object.assign({}, state, {
            templateObject: payload
        });
    }

    if(type === actions.CHANGE_ACTIVE_TEMPLATE_TEXT){
        const {nextTemplate, prevTemplate, prevTemplateText} = payload;
        let templateObject = Object.assign({}, state.templateObject);
        templateObject.templates[prevTemplate] = prevTemplateText;
        return Object.assign({}, state, {
            templateObject,
            activeTemplate: nextTemplate
        });
    }

    if(type === actions.CHANGE_METAHELP_TEXT){
        let templateObject = Object.assign({}, state.templateObject);
        templateObject.metahelp = payload;
        return Object.assign({}, state, {
            templateObject
        });
    }

    if(type === actions.CHANGE_METADATA){
        let templateObject = Object.assign({}, state.templateObject);
        templateObject.metadata = payload;
        return Object.assign({}, state, {
            templateObject
        });
    }

    if(type === actions.CHANGE_DEPENDENCIES){
        let templateObject = Object.assign({}, state.templateObject);
        templateObject.dependencies = payload;
        return Object.assign({}, state, {
            templateObject
        });
    }

    if(type === actions.CHANGE_README_TEXT){
        let templateObject = Object.assign({}, state.templateObject);
        templateObject.readme = payload;
        return Object.assign({}, state, {
            templateObject
        });
    }

    return state;
}

