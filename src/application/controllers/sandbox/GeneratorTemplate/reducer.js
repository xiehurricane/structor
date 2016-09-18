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
    screenshotUrlCounter: 0
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if(type === actions.SET_TEMPLATE){
        let activeTemplate = payload.fileObjects && payload.fileObjects.length > 0 ? payload.fileObjects[0].filePath : undefined;
        return Object.assign({}, state, {
            templateObject: payload,
            activeTemplate: activeTemplate
        });
    }

    if(type === actions.CHANGE_ACTIVE_TEMPLATE_TEXT){
        const {nextTemplate} = payload;
        let templateObject = Object.assign({}, state.templateObject);
        return Object.assign({}, state, {
            templateObject,
            activeTemplate: nextTemplate
        });
    }

    if(type === actions.CHANGE_README_TEXT){
        let templateObject = Object.assign({}, state.templateObject);
        templateObject.readme = payload;
        return Object.assign({}, state, {
            templateObject
        });
    }

    if(type === actions.UPLOAD_SCREENSHOT_DONE){
        return Object.assign({}, state, {
            screenshotUrlCounter: state.screenshotUrlCounter + 1
        });
    }

    return state;
}

