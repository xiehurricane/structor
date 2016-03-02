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

import { Tabs, Tab, Grid, Row, Col } from 'react-bootstrap';
import GlobalOverlay from '../element/GlobalOverlay.js';
import MessageOverlay from '../element/MessageOverlay.js';
import InstalledGeneratorsForm from './InstalledGeneratorsForm.js';
import AvailableGeneratorsForm from './AvailableGeneratorsForm.js';

class Generators extends Component {

    constructor(props) {
        super(props);
    }

    render(){

        var tabPanes = [];

        tabPanes.push(
            <Tab key={'installed'} eventKey={tabPanes.length + 1} title='Installed generators'>
                <InstalledGeneratorsForm />
            </Tab>
        );

        tabPanes.push(
            <Tab key={'available'} eventKey={tabPanes.length + 1} title='Available generators'>
                <AvailableGeneratorsForm />
            </Tab>
        );

        return (
            <div>
                <Grid fluid={true}>
                    <Row>
                        <Col xs={12}>
                            <h3 style={{marginBottom: '1em'}}><span>Project's source code generators</span></h3>
                            <Tabs defaultActiveKey={1}>
                                {tabPanes}
                            </Tabs>
                        </Col>
                    </Row>
                </Grid>
                <MessageOverlay />
                <GlobalOverlay />
            </div>
        )

    }

}

export default Generators;

