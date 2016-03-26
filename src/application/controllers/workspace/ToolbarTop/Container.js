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

import PageListControls from '../PageListControls';
import PageViewControls from '../PageViewControls';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){

        return (
            <div style={this.props.style}>
                <div style={{minWidth: '50em', width: '100%', padding: '5px 10px 5px 10px'}}>
                    <div className="btn-toolbar" role="toolbar" >
                        <PageListControls />
                        <PageViewControls />
                    </div>
                </div>
            </div>
        );
    }
}


export default connect(modelSelector)(Container);

