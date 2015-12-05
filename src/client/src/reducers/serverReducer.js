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

import * as Utils from '../api/utils.js';
import * as Actions from '../actions/serverActions.js';

export default function(state = {}, action = {type: 'UNKNOWN'}){

    const { payload } = action;

    switch (action.type){

        case Actions.WAIT_SERVER_RESPONSE:

            return Object.assign({}, state, {request: {
                method: payload.method,
                activeCount: state.request.activeCount + 1
            }});

        case Actions.RECEIVE_SERVER_RESPONSE_SUCCESS:

            if(payload.resetActiveCounter){
                state = Object.assign({}, state, {request: {
                    method: payload.method,
                    activeCount: 0
                }});
            } else {
                state = Object.assign({}, state, {request: {
                    method: payload.method,
                    activeCount: state.request.activeCount - 1
                }});
            }
            return state;

        case Actions.RECEIVE_SERVER_RESPONSE_FAILURE:
            if(payload.resetActiveCounter){
                state = Object.assign({}, state, {request: {
                    method: payload.method,
                    activeCount: 0
                }});
            } else {
                state = Object.assign({}, state, {request: {
                    method: payload.method,
                    activeCount: state.request.activeCount - 1
                }});
            }
            if(payload.errorText){
                state.messages = state.messages || [];
                state.messages.push({
                    text: payload.errorText,
                    isError: true
                });
                state.messagesCounter++;
            }
            return state;

        case Actions.REMOVE_SERVER_MESSAGE:
            state = Object.assign({}, state);
            state.messages = state.messages || [];
            state.messages.splice(payload.index, 1);
            state.messagesCounter++;
            return state;

        case Actions.SET_SERVER_MESSAGE:
            return (() => {
                state = Utils.fulex(state);
                state.messages = state.messages || [];
                state.messages.push({
                    text: payload.text,
                    isError: payload.isError
                });
                state.messagesCounter++;
                return state;
            })();

        case Actions.SET_SERVER_MESSAGE_BY_OPTIONS:
            return (() => {
                state = Utils.fulex(state);
                state.messages = state.messages || [];
                state.messages.push({
                    text: payload.options.text,
                    isError: payload.options.isError
                });
                state.messagesCounter++;
                return state;
            })();

        //-- Transferred actions from serverActions --------------------------------------------------------------------

        case Actions.DATA_PACKAGE_CONFIG:
            return Object.assign({}, state, { packageVersion: payload.data ? payload.data.version : 'unknown' });

        case Actions.DATA_USER_PROFILE:
            return Object.assign({}, state, { userProfile: { userName: payload.data ? payload.data.login : null } });

        case Actions.DATA_GALLERY_PROJECTS:
            let projects = payload.data || [];
            if(projects.length % 2 > 0){
                projects.push({
                    isEmpty: true
                })
            }
            return Object.assign({}, state, { gallery: { projects: projects } });

        case Actions.DATA_PROJECT_DIR_STATUS:
            return Object.assign({}, state, { projectDirectoryStatus: payload.data });

        case Actions.DATA_PROJECT_CLONED:
            return Object.assign({}, state, { projectDirectoryStatus: payload.data });

        default:
            return state;
    }

}
