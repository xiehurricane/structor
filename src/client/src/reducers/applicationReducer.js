import * as Actions from '../actions/applicationActions.js';

function mergeState(state, newState){
    return state.merge(newState);
}

export default function(state = {}, action = {type: 'UNKNOWN'}){

    const { payload } = action;

    switch (action.type){

        case Actions.SET_APPLICATION_STAGE:
            return Object.assign({}, state, { stage: payload.stage });

        default:
            return state;

    }

}
