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
import { success, failed, timeout, close} from '../AppMessage/actions.js';
import { setReloadPageRequest, executeReloadPageRequest } from '../../workspace/DeskPage/actions.js';
import { loadComponents } from '../../workspace/LibraryPanel/actions.js';

export const GET_PROJECT_STATUS = "AppContainer/GET_PROJECT_STATUS";
export const SET_PROJECT_INFO = "AppContainer/SET_PROJECT_INFO";
export const SET_PROJECT_PROXY_URL = "AppContainer/SET_PROJECT_PROXY_URL";
export const SIGN_IN = "AppContainer/SIGN_IN";
export const SIGN_IN_DONE = "AppContainer/SIGN_IN_DONE";
export const SIGN_IN_FAILED = "AppContainer/SIGN_IN_FAILED";
export const SIGN_IN_CLEAN = "AppContainer/SIGN_IN_CLEAN";
export const SIGN_OUT = "AppContainer/SIGN_OUT";
export const SIGN_OUT_DONE = "AppContainer/SIGN_OUT_DONE";
export const COMPILER_START = "AppContainer/COMPILER_START";
export const COMPILER_DONE = "AppContainer/COMPILER_DONE";
export const COMPILER_TIMEOUT = "AppContainer/COMPILER_TIMEOUT";

export const SHOW_DESK = "AppContainer/SHOW_DESK";
export const SHOW_PROJECTS = "AppContainer/SHOW_PROJECTS";
export const SHOW_GENERATOR = "AppContainer/SHOW_GENERATOR";
export const HIDE_GENERATOR = "AppContainer/HIDE_GENERATOR";
export const SHOW_SANDBOX = "AppContainer/SHOW_SANDBOX";
export const HIDE_SANDBOX = "AppContainer/HIDE_SANDBOX";

export const getProjectStatus = () => ({ type: GET_PROJECT_STATUS });
export const setProjectInfo = (info) => ({ type: SET_PROJECT_INFO, payload: info });
export const setProjectProxyURL = (proxyURL) => ({ type: SET_PROJECT_PROXY_URL, payload: proxyURL });
export const signIn = (email, password, staySignedIn) => ({type: SIGN_IN, payload: {email, password, staySignedIn}});
export const signInDone = (payload) => ({type: SIGN_IN_DONE, payload});
export const signInFailed = (error) => ({type: SIGN_IN_FAILED, payload: error});
export const signInClean = () => ({type: SIGN_IN_CLEAN});
export const signOut = () => ({type: SIGN_OUT});
export const signOutDone = () => ({type: SIGN_OUT_DONE});
export const compilerStart = () => ({ type: COMPILER_START });
export const compilerDone = () => ({ type: COMPILER_DONE });
export const compilerTimeout = () => ({ type: COMPILER_TIMEOUT });

export const showDesk = () => ({type: SHOW_DESK});
export const showGenerator = () => ({type: SHOW_GENERATOR});
export const hideGenerator = () => ({type: HIDE_GENERATOR});
export const showSandbox = () => ({type: SHOW_SANDBOX});
export const hideSandbox = () => ({type: HIDE_SANDBOX});

export const handleCompilerMessage = (message) => (dispatch, getState) => {
    if(message.status === 'start'){
        dispatch(compilerStart());
    } else if(message.status === 'done') {
        if(message.errors && message.errors.length > 0){
            message.errors.forEach( error => {
                dispatch(failed(error.message ? error.message : error));
            });
            dispatch(setReloadPageRequest());
        } else {
            dispatch(loadComponents());
            dispatch(executeReloadPageRequest());
        }
        dispatch(compilerDone());
    }
};

export const containerActions = (dispatch) => bindActionCreators({
    getProjectStatus, signIn, signInDone, signInFailed, signOut
}, dispatch);