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

import { ListGroup, ListGroupItem } from 'react-bootstrap';

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleSelectSample = this.handleSelectSample.bind(this);
    }

    handleSelectSample(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.setGeneratorSample(e.currentTarget.dataset.sampleid);
    }

    render(){
        const { componentModel: {sampleList}} = this.props;
        const cellBoxStyle = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            marginTop: '3em'
        };

        let sampleItemsList = [];
        if (sampleList && sampleList.length > 0) {
            sampleList.forEach((sample, index) => {
                sampleItemsList.push(
                    <ListGroupItem href="#"
                                   key={sample.id + index}
                                   data-sampleid={sample.id}
                                   onClick={this.handleSelectSample}>
                        <span>{sample.description}</span>
                    </ListGroupItem>
                );
            });
        }

        return (
            <div style={cellBoxStyle}>
                <ListGroup>
                    {sampleItemsList}
                </ListGroup>
            </div>
        );
    }
}


export default connect(modelSelector, containerActions)(Container);

