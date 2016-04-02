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

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';

import SelectionControls from '../SelectionControls';
import ClipboardControls from '../ClipboardControls';
import ClipboardIndicator from '../ClipboardIndicator';
import HistoryControls from '../HistoryControls';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){

        const containerStyle = {
            marginTop: '0.2em',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            width: '150em'
            //padding: '0px 0px 0px 10px'
        };

        const labelStyle = {
            padding: '3px 6px',
            borderRadius: '3px',
            cursor: 'pointer',
            backgroundColor: 'rgb(227, 227, 227)',
            color: 'rgb(107, 107, 107)',
            textShadow: '0 1px 0px rgba(255, 255, 255, 0.8)',
            width: '6em'
        };

        const controlsGroupStyle = {
            padding: '0px',
            margin: '0px 0px 0px 0.5em'
        };

        return (
            <div {...this.props}>
                <div style={containerStyle}>
                    <span style={labelStyle}>
                        <span>Selection:</span>
                    </span>
                    <HistoryControls style={controlsGroupStyle} />
                    <ClipboardControls style={controlsGroupStyle} />
                    <SelectionControls style={controlsGroupStyle} />
                    <ClipboardIndicator style={controlsGroupStyle} />
                </div>
            </div>
        );
    }
}


export default connect(modelSelector)(Container);

