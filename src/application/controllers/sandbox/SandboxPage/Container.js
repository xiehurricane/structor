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

import {isEmpty} from 'lodash';
import validator from 'validator';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';
import { sandboxGraphApi } from '../../../api';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        const contentWindow = this.refs.livePreviewFrame.contentWindow;
        contentWindow.onPageWillMount = (page) => {
            page.bindGetPageModel(() => {
                const keys = sandboxGraphApi.getVariantKeys();
                if(keys && keys.length > 0){
                    return sandboxGraphApi.getWrappedModelForVariant(keys[0]);
                }
            });
            this.props.setAvailableToPublish(true);
            this.props.success('Test component source code has been compiled successfully. Look at the live preview.');
        };
        //this.refs.livePreviewFrame.onload = (() => {
        //});
    }

    render() {
        const iframeStyle = {
            height : '42.5em',
            width : '100%',
            minWidth : '320px',
            border : '1px solid #000000'
        };
        return (
            <iframe ref="livePreviewFrame" style={iframeStyle} frameBorder="0" src="/structor-sandbox-preview/index.html" />
        );
    }

}

export default connect(modelSelector, containerActions)(Container);

