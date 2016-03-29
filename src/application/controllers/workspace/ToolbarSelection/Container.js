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

import SelectionBreadcrumbs from '../SelectionBreadcrumbs';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){

        const containerStyle = {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
            //padding: '0px 0px 0px 10px'
        };

        return (
            <div {...this.props}>
                <div style={containerStyle}>
                    <SelectionBreadcrumbs />
                    <div className="btn-toolbar" role="toolbar" >
                    </div>
                </div>
            </div>
        );
    }
}


export default connect(modelSelector)(Container);

