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

import _ from 'lodash';
import validator from 'validator';
import docCookies from '../api/cookies.js';
import * as Utils from '../api/utils.js';
import * as UtilStore from '../api/utilStore.js';
import * as ServerActions from './serverActions.js';
import * as DeskPageActions from './deskPageActions.js';
import * as ApplicationActions from './applicationActions.js';
import {makeRequest} from '../api/restApi.js';

export const SHOW_MODAL_SIGN_IN = 'SHOW_MODAL_SIGN_IN';
export const HIDE_MODAL_SIGN_IN = 'HIDE_MODAL_SIGN_IN';

export function showModalSignIn(){

    return {
        type: SHOW_MODAL_SIGN_IN
    };

}

export function hideModalSignIn(){
    return {
        type: HIDE_MODAL_SIGN_IN
    }
}

export function signIn(email, password, staySigned){
    return (dispatch, getState) => {
        if(!email || email.length <= 0){
            dispatch(ServerActions.setServerMessage('Please enter e-mail address value'));
        } else if( !validator.isEmail(email) ){
            dispatch(ServerActions.setServerMessage('Please enter valid e-mail address value'));
        } else {

            const method = 'initUserCredentials';

            dispatch(ServerActions.waitServerResponse(method));

            return makeRequest(method, { username: email, password: password })
                .then(response => {
                    if(staySigned === true){
                        docCookies.setItem("structor-market-token", response.data.token, 31536e3, "/");
                    }
                    dispatch({
                        type: ApplicationActions.SET_USER_CREDENTIALS,
                        payload: response
                    });
                    dispatch(ServerActions.receiveServerResponseSuccess(method));
                    dispatch(ServerActions.setServerMessage('Authentication was successful', false));
                    dispatch({
                        type: HIDE_MODAL_SIGN_IN
                    });
                })
                .catch( error => {
                    dispatch(ServerActions.receiveServerResponseFailure(method, error.message));
                });
        }
    };
}
