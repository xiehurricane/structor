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

export const GET_PROJECT_INFO = "AppContainer/GET_PROJECT_INFO";
export const GET_PROJECT_INFO_DONE = "AppContainer/GET_PROJECT_INFO_DONE";
export const SIGN_IN = "AppContainer/SIGN_IN";
export const SIGN_IN_DONE = "AppContainer/SIGN_IN_DONE";
export const SIGN_IN_FAILED = "AppContainer/SIGN_IN_FAILED";
export const SIGN_OUT = "AppContainer/SIGN_OUT";

export const getProjectInfo = () => ({ type: GET_PROJECT_INFO });
export const getProjectInfoDone = (payload) => ({type: GET_PROJECT_INFO_DONE, payload});
export const signIn = (email, password, staySignedIn) => ({type: SIGN_IN, payload: {email, password, staySignedIn}});
export const signInDone = (payload) => ({type: SIGN_IN_DONE, payload});
export const signInFailed = (error) => ({type: SIGN_IN_FAILED, payload: error});
export const signOut = () => ({type: SIGN_OUT});