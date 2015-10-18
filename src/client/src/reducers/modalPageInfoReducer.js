import * as Actions from '../actions/modalPageInfoActions.js';
import * as Utils from '../api/utils.js';
import * as UtilStore from '../api/utilStore.js';

export default function(state = {}, action = {type: 'UNKNOWN'}){

    const { payload } = action;

    switch (action.type){

        case Actions.SHOW_MODAL_PAGE_INFO: //---------------------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.isOpen = true;
                state.pageName = payload.pageName;
                state.pagePath = payload.pagePath;
                state.pageScript = payload.pageScript;
                state.pageProps = payload.pageProps;
                state.pageTitle = payload.pageTitle;
                return state;
            })();

        case Actions.HIDE_MODAL_PAGE_INFO: //---------------------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.isOpen = false;
                return state;
            })();


        default:
            return state;

    }

}
