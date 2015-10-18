import * as Actions from '../actions/modalProxySetupActions.js';
import * as Utils from '../api/utils.js';
import * as UtilStore from '../api/utilStore.js';

export default function(state = {}, action = {type: 'UNKNOWN'}){

    const { payload } = action;

    switch (action.type){

        case Actions.SHOW_MODAL_PROXY_SETUP: //-------------------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.isOpen = true;
                state.urlValue = payload.data.proxyURL;
                return state;
            })();

        case Actions.HIDE_MODAL_PROXY_SETUP: //-------------------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.isOpen = false;
                return state;
            })();

        default:
            return state;

    }

}
