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
    componentsTree: {},
    defaultVariantMap: {},
    componentInPreview: undefined,
    variantsInPreview: []
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if(type === actions.SET_COMPONENTS){
        return Object.assign({}, state, {
            componentsTree: payload.componentsTree
        });
    }

    if(type === actions.PREVIEW_COMPONENT){
        const {componentName, variants} = payload;
        let defaultVariantMap = state.defaultVariantMap;
        let defaultVariant = defaultVariantMap[componentName];
        if(!defaultVariant || !defaultVariant.key){
            if(variants && variants.length > 0){
                defaultVariantMap[componentName] = { key: variants[0] };
            }
        }
        return Object.assign({}, state, {
            componentInPreview: componentName,
            variantsInPreview: variants,
            defaultVariantMap: defaultVariantMap
        });
    }

    if(type === actions.HIDE_PREVIEW){
        return Object.assign({}, state, {
            componentInPreview: undefined
        });
    }

    if(type === actions.SET_DEFAULT_VARIANT){
        let defaultVariantMap = state.defaultVariantMap;
        defaultVariantMap[payload.componentName] = { key: payload.variant };
        return Object.assign({}, state, {
            defaultVariantMap: defaultVariantMap
        });
    }

    return state;
}

