'use strict';

// third-party libs
import '../lib/bootstrap/css/custom/bootstrap.css';
import '../lib/bootstrap/js/bootstrap.js';
import '../lib/font-awesome/css/font-awesome.css';
import '../lib/react-widgets/css/react-widgets.css';
// umyproto libs
import '../css/umyproto.deskpage.css';

import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import storeManager from './store/storeManager.js';
import initialState from './store/initialState.js';
import { setApplicationState } from './actions/applicationActions.js';
import { handleCompilerMessage } from './actions/webSocketActions.js';
import { Provider } from 'react-redux';
import Application from './components/application/Application.js';
//import { fromJS } from 'immutable';
import { init } from './plugin/plugins.js';
import docCookie from './api/cookies.js';

const user = docCookie.getItem("helmet-react-ui-builder-user");
const pass = docCookie.getItem("helmet-react-ui-builder-pass");

init();

//Server.init({io: window.io, serverHost: window.location.hostname});

//window.onbeforeunload = function(e) {
//    ApplicationActions.stopAutosaveProjectModel();
//
//};

const store = storeManager(initialState);

const { protocol, hostname, port } = window.location;
const socket = io.connect(protocol + '//' + hostname + ':' + port);
socket.on( 'invitation', message => console.log(message) );
socket.on( 'compiler.message', stats => {
    store.dispatch(handleCompilerMessage(stats));
});

//const socket = io(`${location.protocol}//${location.hostname}:8090`);
//socket.on('state', state =>
//        store.dispatch({type: 'SET_STATE', state})
//);


ReactDOM.render(
    <Provider store={store}>
        <Application />
    </Provider>,
    document.getElementById('content')
);

