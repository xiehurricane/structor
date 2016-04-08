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
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import EncapsulatedFrame from '../../../profiles/encapsulated/GeneratorFrame';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){

        const { componentModel: {} } = this.props;

        let frameStyle = {
            display: 'block',
            width : "90%",
            minWidth : "320px",
            margin : "0px",
            padding : "0px"
        };
        let content = null;

        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
                <div style={frameStyle}>
                    {content}
                </div>
            </div>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);

