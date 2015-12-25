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

'use strict';

// third-party libs
import '../lib/bootstrap/css/custom/bootstrap.css';
import '../lib/bootstrap/js/bootstrap.js';
import '../lib/font-awesome/css/font-awesome.css';
import '../lib/react-widgets/css/react-widgets.css';
// umyproto libs
import '../css/umyproto.deskpage.css';
//
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import storeManager from './store/storeManager.js';
import initialState from './store/initialState.js';
import { Provider } from 'react-redux';
import Documentation from './components/documentation/Documentation.js';

const store = storeManager(initialState);

ReactDOM.render(
    <Provider store={store}>
        <Documentation />
    </Provider>,
    document.getElementById('content')
);

