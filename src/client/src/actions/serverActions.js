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

import 'isomorphic-fetch';

export const WAIT_SERVER_RESPONSE = 'WAIT_SERVER_RESPONSE';
export const RECEIVE_SERVER_RESPONSE_SUCCESS = 'RECEIVE_SERVER_RESPONSE_SUCCESS';
export const RECEIVE_SERVER_RESPONSE_FAILURE = 'RECEIVE_SERVER_RESPONSE_FAILURE';
export const REMOVE_SERVER_MESSAGE = 'REMOVE_SERVER_MESSAGE';
export const SET_SERVER_MESSAGE = 'SET_SERVER_MESSAGE';
export const SET_SERVER_MESSAGE_BY_OPTIONS = 'SET_SERVER_MESSAGE_BY_OPTIONS';

// -- Transferable actions
export const DATA_USER_PROFILE = 'DATA_USER_PROFILE';
export const DATA_PACKAGE_CONFIG = 'DATA_PACKAGE_CONFIG';
export const DATA_GALLERY_PROJECTS = 'DATA_GALLERY_PROJECTS';
export const DATA_PROJECT_DIR_STATUS = 'DATA_PROJECT_DIR_STATUS';
export const DATA_PROJECT_CLONED = 'DATA_PROJECT_CLONED';

export function waitServerResponse(method){
    return {
        type: WAIT_SERVER_RESPONSE,
        payload: { method: method }
    }
}

export function receiveServerResponseSuccess(method, resetActiveCounter = false){
    return {
        type: RECEIVE_SERVER_RESPONSE_SUCCESS,
        payload: { method: method, resetActiveCounter: resetActiveCounter }
    }
}

export function receiveServerResponseFailure(method, errorText, resetActiveCounter = false){
    return {
        type: RECEIVE_SERVER_RESPONSE_FAILURE,
        payload: { method: method, errorText: errorText, resetActiveCounter: resetActiveCounter }
    }
}

export function removeMessage(index){
    return {
        type: REMOVE_SERVER_MESSAGE,
        payload: { index: index }
    }
}

export function setServerMessage(text, isError = true){
    return {
        type: SET_SERVER_MESSAGE,
        payload: { text: text, isError: isError }
    }
}

export function transferDataToAction(type, options = null, data = null){
    return {
        type: type,
        payload: { options: options, data: data }
    }
}

export function invoke(method, options, transferActions = [], transferOptions = null, isSoftErrorIgnored = false){
    //console.log('Server invokes method: ' + method);
    return dispatch => {

        dispatch(waitServerResponse(method));

        fetch('/invoke', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                methodName: method,
                data: options
            })
        })
            .then( response => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                } else {
                    var error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            })
            .then( response => {
                return response.json();
            })
            .then( data => {
                //console.log('request succeeded with JSON response');
                //console.log(JSON.stringify(data, null, 4));
                if(data.error === true){
                    //console.error('['+ method +'] Received error: ' + JSON.stringify(data.errors));
                    if(isSoftErrorIgnored){
                        transferActions.forEach( actionType => {
                            dispatch(transferDataToAction(actionType, transferOptions, null));
                        });
                        dispatch(receiveServerResponseFailure(method, null));

                    } else {
                        dispatch(receiveServerResponseFailure(method, JSON.stringify(data.errors)));
                    }
                } else {
                    transferActions.forEach( actionType => {
                        dispatch(transferDataToAction(actionType, transferOptions, data.data));
                    });
                    dispatch(receiveServerResponseSuccess(method));
                }
            }).catch( error => {
                //console.log('request failed', error);
                dispatch(receiveServerResponseFailure(method, error));
            })

    }
}

export function invokeSilently(method, options, transferActions = [], transferOptions = null){
    //console.log('Server silently invokes method: ' + method);
    return dispatch => {

        fetch('/invoke', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                methodName: method,
                data: options
            })
        })
            .then( response => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                } else {
                    var error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            })
            .then( response => {
                return response.json();
            })
            .then( data => {
                //console.log('request succeeded with JSON response');
                //console.log(JSON.stringify(data, null, 4));
                if(data.error === true){
                    console.error('['+ method +'] Received error: ' + JSON.stringify(data.errors));
                } else {
                    transferActions.forEach( actionType => {
                        dispatch(transferDataToAction(actionType, transferOptions, data.data));
                    });
                }
            }).catch( error => {
                console.error('request failed', error);
            })

    }
}
