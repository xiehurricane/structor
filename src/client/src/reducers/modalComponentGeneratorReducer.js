import * as Actions from '../actions/modalComponentGeneratorActions.js';
import * as Utils from '../api/utils.js';
import * as UtilStore from '../api/utilStore.js';

export default function(state = {}, action = {type: 'UNKNOWN'}){

    const { payload } = action;

    switch (action.type){

        case Actions.SHOW_MODAL_COMPONENT_GENERATOR: //-----------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.isOpen = true;
                state.groupName = null;
                state.componentName = null;
                return state;
            })();

        case Actions.HIDE_MODAL_COMPONENT_GENERATOR: //-----------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.isOpen = false;
                state.componentSourceDataObject = null;
                state.step = 0;
                return state;
            })();

        case Actions.COMPONENT_GENERATOR_START_STEP_0: //---------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.step = 0;
                state.groupNames = payload.groupNames;
                return state;
            })();

        case Actions.COMPONENT_GENERATOR_SUBMIT_STEP_0: //--------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.groupName = payload.groupName;
                state.componentName = payload.componentName;
                return state;
            })();

        case Actions.COMPONENT_GENERATOR_START_STEP_1: //---------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.step = 1;
                state.generatorList = payload.data;
                return state;
            })();

        case Actions.COMPONENT_GENERATOR_SUBMIT_STEP_1: //--------------------------------------------------------------
            return (() => {
                //state = Utils.fulex(state);
                return state;
            })();

        case Actions.COMPONENT_GENERATOR_START_STEP_2: //---------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.step = 2;
                if(payload.data && payload.options){
                    state.metaModel = JSON.stringify(payload.data.metaModel, null, 4);
                    state.metaHelp = payload.data.metaHelp;
                    state.selectedGeneratorName = payload.options.generatorName;
                }
                return state;
            })();

        case Actions.COMPONENT_GENERATOR_SUBMIT_STEP_2: //--------------------------------------------------------------
            return (() => {
                //state = Utils.fulex(state);
                return state;
            })();

        case Actions.COMPONENT_GENERATOR_START_STEP_3: //---------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.step = 3;
                state.metaModel = payload.options.metaModel;
                state.componentSourceDataObject = payload.data;
                return state;
            })();

        case Actions.COMPONENT_GENERATOR_SUBMIT_STEP_3: //--------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.generatedComponentsCounter++;
                return state;
            })();

        case Actions.COMPONENT_GENERATOR_RESET_GENERATED_COUNTER: //----------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.generatedComponentsCounter = 0;
                return state;
            })();

        default:
            return state;

    }

}
