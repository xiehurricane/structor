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
import SelectionBreadcrumbs from '../SelectionBreadcrumbs';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){

        const containerStyle = {
            paddingTop: '10px',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            width: '150em'
            //padding: '0px 0px 0px 10px'
        };

        //const labelStyle = {
        //    padding: '3px 6px',
        //    borderRadius: '3px',
        //    cursor: 'pointer',
        //    backgroundColor: 'rgb(227, 227, 227)',
        //    color: 'rgb(107, 107, 107)',
        //    textShadow: '0 1px 0px rgba(255, 255, 255, 0.8)',
        //    width: '6em'
        //};

        const controlsGroupStyle = {
            padding: '0px',
            margin: '0px 0px 0px 0.5em'
        };

        const breadCrumbsStyle = {
            padding: '0px',
            margin: '0px 0.5em 0 0.5em'
        };

        return (
            <div style={this.props.style}>
                <div style={containerStyle}>
                    <PageListControls style={controlsGroupStyle} />
                    <PageViewControls style={controlsGroupStyle} />
                    <SelectionBreadcrumbs style={breadCrumbsStyle} />
                </div>
            </div>
        );
    }
}


export default connect(modelSelector)(Container);

