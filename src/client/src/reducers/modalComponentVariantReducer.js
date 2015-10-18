import * as Actions from '../actions/modalComponentVariantActions.js';
import * as Utils from '../api/utils.js';

export default function(state = {}, action = {type: 'UNKNOWN'}){

    const { payload } = action;

    switch (action.type){

        case Actions.SHOW_MODAL_COMPONENT_VARIANT: //-------------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.isOpen = true;
                return state;
            })();

        case Actions.HIDE_MODAL_COMPONENT_VARIANT: //-------------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.isOpen = false;
                return state;
            })();

        case Actions.COMPONENT_VARIANT_START_STEP_0: //-----------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.step = 0;

                return state;
            })();

        case Actions.COMPONENT_VARIANT_SUBMIT_STEP_0: //----------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                return state;
            })();

        case Actions.COMPONENT_VARIANT_START_STEP_1: //-----------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.step = 1;
                return state;
            })();

        default:
            return state;

    }

}
