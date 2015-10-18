'use strict';

// third-party libs
import '../lib/bootstrap/css/custom/bootstrap.css';
import '../lib/bootstrap/js/bootstrap.js';
import '../lib/font-awesome/css/font-awesome.css';
import '../lib/react-widgets/css/react-widgets.css';
// umyproto libs
import '../css/umyproto.deskpage.css';
//
import 'babel-core/polyfill';
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

