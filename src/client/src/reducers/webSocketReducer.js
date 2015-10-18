import * as Actions from '../actions/webSocketActions.js';


export default function(state = {}, action = {type: 'UNKNOWN'}){

    const { payload } = action;

    switch (action.type){

        case Actions.HANDLE_COMPILER_DONE:
            return Object.assign({}, state, { compilerStats: payload.stats });

        default:
            return state;

    }

}
