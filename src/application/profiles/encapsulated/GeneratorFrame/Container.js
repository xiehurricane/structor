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
import { containerActions } from './actions.js';

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleOnClose = this.handleOnClose.bind(this);
    }

    handleOnClose(e){
        e.stopPropagation();
        e.preventDefault();
        const { hideFrame } = this.props;
        hideFrame();
    }

    render() {

        let content = (
            <div>
                <h3 className="text-primary">Hello from Sandbox !</h3>
                <button className="btn btn-primary" onClick={this.handleOnClose}>Close</button>
            </div>
        );
        return (
            <div style={{overflow: 'hidden'}}>
                <div ref='appBody' style={{position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px'}}>
                    {content}
                </div>
            </div>
        );
    }
}

export default connect( modelSelector, containerActions)(Container);

