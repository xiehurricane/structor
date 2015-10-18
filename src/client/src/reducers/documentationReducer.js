import * as Utils from '../api/utils.js';
import * as Actions from '../actions/documentationActions.js';

export default function(state = {}, action = {type: 'UNKNOWN'}){

    const { payload } = action;

    switch (action.type){

        case Actions.SET_PROJECT_DOCUMENT:
            return (() => {
                return Object.assign({}, state, {
                    projectDoc: payload.data
                });
            })();

        case Actions.CHANGE_PROJECT_DOCUMENT:
            return (() => {
                return state;
            })();

        default:
            return state;

    }

}
