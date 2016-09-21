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

import validator from 'validator';
import {isEmpty} from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { Grid, Row, Col, Button } from 'react-bootstrap';
import marked from 'marked';
import { InputTextStateful, AceEditor } from '../../../views';

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    validateName(value) {
        return value
            && value.length > 0
            && validator.isAlphanumeric(value);
    }

    handleOnSubmit(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.startGeneration(this.refs.groupNameInput.getValue(),
            this.refs.componentNameInput.getValue(),
            this.refs.metadataEditor ? this.refs.metadataEditor.getSourceCode() : undefined);
    }

    render() {

        const { componentModel: {selectedGenerator, groupName, componentName, metaData}, libraryPanelModel: {groupsList, componentsList} } = this.props;
        const metaHelpText = selectedGenerator.metaHelp !== 'NONE' ? marked(selectedGenerator.metaHelp) : null;
        const cellBoxStyle = {
            display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'
        };

        let groupDataOptions = [];
        if (groupsList && groupsList.length > 0) {
            groupsList.forEach((name, index) => {
                groupDataOptions.push(
                    <option key={index}>{name}</option>
                )
            });
        }
        let componentsDataOptions = [];
        if (componentsList && componentsList.length > 0) {
            componentsList.forEach((name, index) => {
                componentsDataOptions.push(
                    <option key={index}>{name}</option>
                )
            });
        }
        let content = null;
        if(metaHelpText && !isEmpty(metaData)){
            content = (
                <Grid fluid={ true }>
                    <Row style={ { position: 'relative'} }>
                        <Col
                            xs={ 12 }
                            md={ 6 }
                            sm={ 6 }
                            lg={ 6 }>

                            <div style={cellBoxStyle}>
                                <div style={{width: '70%', minWidth: '200px'}}>
                                    <form onSubmit={this.handleOnSubmit}>
                                        <label htmlFor="groupNameInput">Component group</label>
                                        <InputTextStateful
                                            validateFunc={this.validateName}
                                            placeholder="Enter group name"
                                            id="groupNameInput"
                                            ref="groupNameInput"
                                            type="text"
                                            list="groups"
                                            value={groupName}
                                            autoComplete="on"/>
                                        <datalist id="groups">
                                            {groupDataOptions}
                                        </datalist>
                                        <label htmlFor="componentNameInput">Component name</label>
                                        <InputTextStateful
                                            validateFunc={this.validateName}
                                            placeholder="Enter component name"
                                            id="componentNameInput"
                                            ref="componentNameInput"
                                            type="text"
                                            list="components"
                                            value={componentName}
                                            autoComplete="on"/>
                                        <datalist id="components">
                                            {componentsDataOptions}
                                        </datalist>
                                        <div style={{display: 'flex', justifyContent: 'center'}}>
                                            <Button type="submit" bsStyle="primary">Generate source code</Button>
                                        </div>
                                    </form>
                                    <div style={{marginTop: '2em'}}>
                                        <div dangerouslySetInnerHTML={{__html: metaHelpText}}></div>
                                    </div>
                                </div>
                            </div>

                        </Col>
                        <Col
                            xs={ 12 }
                            md={ 6 }
                            sm={ 6 }
                            lg={ 6 }>

                            <div style={cellBoxStyle}>
                                <div style={{width: '100%', height: '100%'}}>
                                    <label htmlFor="metadataEditor">Metadata</label>
                                    <AceEditor id="metadataEditor"
                                               ref="metadataEditor"
                                               sourceName="metadataScript"
                                               style={{width: '100%', height: '50.5em', borderRadius: '3px', border: '1px solid #cdcdcd'}}
                                               sourceCode={JSON.stringify(metaData, null, 4)}/>

                                    <div style={{marginTop: '1.5em'}}>
                                        <p>Enter valid data in JSON format</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            );
        } else {
            content = (
                <Grid fluid={ true }>
                    <Row style={ { position: 'relative'} }>
                        <Col
                            xs={ 6 }
                            md={ 6 }
                            sm={ 6 }
                            lg={ 6 }
                            xsOffset={3}
                            mdOffset={3}
                            smOffset={3}
                            lgOffset={3}>
                            <div style={cellBoxStyle}>
                                <div style={{width: '70%', minWidth: '200px'}}>
                                    <form onSubmit={this.handleOnSubmit}>
                                        <label htmlFor="groupNameInput">Component group</label>
                                        <InputTextStateful
                                            validateFunc={this.validateName}
                                            placeholder="Enter group name"
                                            id="groupNameInput"
                                            ref="groupNameInput"
                                            type="text"
                                            list="groups"
                                            value={groupName}
                                            autoComplete="on"/>
                                        <datalist id="groups">
                                            {groupDataOptions}
                                        </datalist>
                                        <label htmlFor="componentNameInput">Component name</label>
                                        <InputTextStateful
                                            validateFunc={this.validateName}
                                            placeholder="Enter component name"
                                            id="componentNameInput"
                                            ref="componentNameInput"
                                            type="text"
                                            list="components"
                                            value={componentName}
                                            autoComplete="on"/>
                                        <datalist id="components">
                                            {componentsDataOptions}
                                        </datalist>
                                        <div style={{display: 'flex', justifyContent: 'center'}}>
                                            <Button type="submit" bsStyle="primary">Generate source code</Button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </Col>
                    </Row>
                </Grid>
            );
        }
        return (
            <div>
                {content}
            </div>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);

