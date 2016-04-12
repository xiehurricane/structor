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
import { utilsStore, HtmlComponents } from '../../../api/index.js';

const initialState = {
    userAccount: {
        email: null,
        regDate: null,
        subscriptionDescription: null,
        subscriptionStartDate: null,
        subscriptionEndDate: null
    },
    authentication: {
        error: undefined
    },
    packageConfig: {},
    projectStatus: null,
    workspaceMode: null,
    isGeneratorFrameShown: false
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if(type === actions.GET_PROJECT_INFO_DONE){

        return Object.assign({}, state, {
            packageConfig: payload.projectConfig.server.packageConf,
            projectStatus: payload.projectConfig.status,
            workspaceMode: 'desk'
        });
    }

    //if(type === actions.SIGN_IN){
    //    return Object.assign({}, state, {
    //        authentication: {
    //            error: null
    //        }
    //    });
    //}

    if(type === actions.SIGN_IN_DONE){
        return Object.assign({}, state, {
            userAccount: payload
        });
    }

    if(type === actions.SIGN_IN_FAILED){
        return Object.assign({}, state, {
            authentication: {
                error: payload.message ? payload.message : payload
            }
        });
    }

    if(type === actions.SIGN_IN_CLEAN){
        return Object.assign({}, state, {
            authentication: {
                error: undefined
            }
        });
    }

    if(type === actions.SIGN_OUT_DONE){
        return Object.assign({}, state, {
            userAccount: initialState.userAccount
        });
    }

    if(type === actions.SHOW_GENERATOR){
        return Object.assign({}, state, {
            workspaceMode: 'generator'
        });
    }

    if(type === actions.HIDE_GENERATOR){
        return Object.assign({}, state, {
            workspaceMode: 'desk'
        });
    }

    return state;

}


