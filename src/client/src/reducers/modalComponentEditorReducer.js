import * as Actions from '../actions/modalComponentEditorActions.js';
import * as Utils from '../api/utils.js';
import * as UtilStore from '../api/utilStore.js';

export default function(state = {}, action = {type: 'UNKNOWN'}){

    const { payload } = action;

    switch (action.type){

        case Actions.SHOW_MODAL_COMPONENT_EDITOR: //--------------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.isOpen = true;
                let component = payload.component;
                let componentObjectValue = payload.componentObjectValue;
                Utils.cleanPropsUmyId(component);
                component.props = component.props || {};
                state.componentText = component.text;
                state.propsScript = JSON.stringify(component.props, null, 4);
                state.componentName = component.type;
                state.componentGroup = componentObjectValue.group;
                state.documentMarkdown = null;
                state.sourceCode = null;
                state.sourceFilePath = componentObjectValue.value ? componentObjectValue.value.absoluteSource : null;
                return state;
            })();

        case Actions.HIDE_MODAL_COMPONENT_EDITOR: //--------------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.isOpen = false;
                return state;
            })();

        case Actions.SET_COMPONENT_DOCUMENT: //-------------------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                state.documentMarkdown = payload.data;
                return state;
            })();

        case Actions.SET_COMPONENT_SOURCE_CODE: //----------------------------------------------------------------------
            return (() => {
                state = Utils.fulex(state);
                if(payload.data){
                    state.sourceCode = payload.data;
                } else {
                    state.sourceCode = null;
                }
                return state;
            })();


        default:
            return state;

    }

}
