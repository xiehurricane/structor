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

import * as Utils from '../api/utils.js';
import * as UtilStore from '../api/utilStore.js';
import * as ServerActions from './serverActions.js';
import * as DeskPageActions from './deskPageActions.js';

export const SHOW_MODAL_PROXY_SETUP = 'SHOW_MODAL_PROXY_SETUP';
export const HIDE_MODAL_PROXY_SETUP = 'HIDE_MODAL_PROXY_SETUP';

export function showModalProxySetup(){

    return (dispatch, getState) => {
        dispatch(
            ServerActions.invoke('setProjectProxy',
                {},
                [SHOW_MODAL_PROXY_SETUP],
                null,
                true
            )
        );
    }

}

export function hideModalProxySetup(){
    return {
        type: HIDE_MODAL_PROXY_SETUP
    }
}

export function saveModalProxySetup(urlValue){

    return (dispatch, getState) => {

        var proxyURLDelete = (!urlValue || urlValue.length <= 0);

        dispatch(
            ServerActions.invoke('setProjectProxy',
                {
                    proxyURL: urlValue,
                    proxyURLDelete: proxyURLDelete
                },
                [HIDE_MODAL_PROXY_SETUP],
                null,
                false
            )
        );
    }

}
