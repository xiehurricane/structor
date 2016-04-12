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

export const GET_PROJECT_INFO = "AppContainer/GET_PROJECT_INFO";
export const GET_PROJECT_INFO_DONE = "AppContainer/GET_PROJECT_INFO_DONE";
export const SIGN_IN = "AppContainer/SIGN_IN";
export const SIGN_IN_DONE = "AppContainer/SIGN_IN_DONE";
export const SIGN_IN_FAILED = "AppContainer/SIGN_IN_FAILED";
export const SIGN_IN_CLEAN = "AppContainer/SIGN_IN_CLEAN";
export const SIGN_OUT = "AppContainer/SIGN_OUT";
export const SIGN_OUT_DONE = "AppContainer/SIGN_OUT_DONE";
export const SHOW_GENERATOR = "AppContainer/SHOW_GENERATOR";
export const HIDE_GENERATOR = "AppContainer/HIDE_GENERATOR";

export const getProjectInfo = () => ({ type: GET_PROJECT_INFO });
export const getProjectInfoDone = (payload) => ({type: GET_PROJECT_INFO_DONE, payload});
export const signIn = (email, password, staySignedIn) => ({type: SIGN_IN, payload: {email, password, staySignedIn}});
export const signInDone = (payload) => ({type: SIGN_IN_DONE, payload});
export const signInFailed = (error) => ({type: SIGN_IN_FAILED, payload: error});
export const signInClean = () => ({type: SIGN_IN_CLEAN});
export const signOut = () => ({type: SIGN_OUT});
export const signOutDone = () => ({type: SIGN_OUT_DONE});
export const showGenerator = () => ({type: SHOW_GENERATOR});
export const hideGenerator = () => ({type: HIDE_GENERATOR});

export const containerActions = (dispatch) => bindActionCreators({
    getProjectInfo, getProjectInfoDone, signIn, signInDone, signInFailed, signOut
}, dispatch);