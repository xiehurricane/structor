import {combineReducers} from 'redux';
import applicationReducer from './applicationReducer.js';
import documentationReducer from './documentationReducer.js';
import serverReducer from './serverReducer.js';
import deskReducer from './deskReducer.js';
import webSocketReducer from './webSocketReducer.js';
import deskPageReducer from './deskPageReducer.js';
import modalComponentEditorReducer from './modalComponentEditorReducer.js';
import modalComponentGeneratorReducer from './modalComponentGeneratorReducer.js';
import modalPageInfoReducer from './modalPageInfoReducer.js';
import modalProxySetupReducer from './modalProxySetupReducer.js';
import modalComponentVariantReducer from './modalComponentVariantReducer.js';

const rootReducer = combineReducers({
    application: applicationReducer,
    documentation: documentationReducer,
    server: serverReducer,
    desk: deskReducer,
    webSocket: webSocketReducer,
    deskPage: deskPageReducer,
    modalComponentEditor: modalComponentEditorReducer,
    modalComponentGenerator: modalComponentGeneratorReducer,
    modalPageInfo: modalPageInfoReducer,
    modalProxySetup: modalProxySetupReducer,
    modalComponentVariant: modalComponentVariantReducer
});

export default rootReducer;