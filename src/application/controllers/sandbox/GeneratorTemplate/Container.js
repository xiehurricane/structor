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

import { ListGroup, ListGroupItem, Tabs, Tab } from 'react-bootstrap';
import { Grid, Row, Col, Button } from 'react-bootstrap';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const { componentModel: {templateObject} } = this.props;
        const {templates, dependencies} = templateObject;
        const buttonLabelStyle = {
            margin: '0 0.5em'
        };
        return (
            <Tabs defaultActiveKey={1} animation={false}>
                <Tab key={'fileList'} eventKey={1} title="Source code templates">

                </Tab>
                <Tab key={'metadata'} eventKey={2} title="Metadata">
                </Tab>
                <Tab key={'dependencies'} eventKey={2} title="Dependencies">
                </Tab>
            </Tabs>
        );
    }
}


export default connect(modelSelector, containerActions)(Container);

