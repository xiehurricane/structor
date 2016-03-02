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
import * as ApplicationActions from './applicationActions.js';
import * as ServerActions from './serverActions.js';
import {makeRequest} from '../api/restApi.js';

export const GET_INSTALLED_GENERATORS_LIST = 'GET_INSTALLED_GENERATORS_LIST';
export const SET_INSTALLED_FILTER = 'SET_INSTALLED_FILTER';
export const GET_AVAILABLE_GENERATORS_LIST = 'GET_AVAILABLE_GENERATORS_LIST';
export const SET_AVAILABLE_FILTER = 'SET_AVAILABLE_FILTER';

export function getInstalledGeneratorsList(){
    return (dispatch, getState) => {
        dispatch(
            ServerActions.invoke('getGeneratorList',
                {},
                [GET_INSTALLED_GENERATORS_LIST]
            )
        );
    }
}

export function getAvailableGeneratorList(){
    return (dispatch, getState) => {
        dispatch(
            ServerActions.invoke('getAvailableGeneratorList',
                {},
                [GET_AVAILABLE_GENERATORS_LIST]
            )
        );
    }
}

export function setFilterForInstalled(filter){
    return {
        type: SET_INSTALLED_FILTER, payload: filter
    }
}

export function setFilterForAvailable(filter){
    return {
        type: SET_AVAILABLE_FILTER, payload: filter
    }
}

export function installGenerator(key, version){
    console.log('Installing generator: ' + key + ' version: ' + version);
    return {
        type: 'Unnimplemented'
    };
}

export function uninstallGenerator(key){
    console.log('Uninstalling generator: ' + key);
    return {
        type: 'Unnimplemented'
    };
}
