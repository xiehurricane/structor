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
