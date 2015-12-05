/*
 * Copyright 2015 Alexander Pustovalov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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