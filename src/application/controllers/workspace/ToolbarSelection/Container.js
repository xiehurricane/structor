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
import SelectionControls from '../SelectionControls';

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
            alignItems: 'center'
            //padding: '0px 0px 0px 10px'
        };

        const breadCrumbsStyle = {
            padding: '0px 1.3em',
            margin: '0px'
        };

        const controlsGroupStyle = {
            padding: '0px',
            margin: '0px'
        };

        return (
            <div {...this.props}>
                <div style={containerStyle}>
                    <SelectionBreadcrumbs style={breadCrumbsStyle} />
                    <div className="btn-toolbar" role="toolbar" >
                        <SelectionControls style={controlsGroupStyle} />
                    </div>
                </div>
            </div>
        );
    }
}


export default connect(modelSelector)(Container);

