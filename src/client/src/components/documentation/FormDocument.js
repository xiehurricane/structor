
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

import _ from 'lodash';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
    Grid, Row, Col, Panel, Button, Nav, CollapsibleNav, Input,
    Navbar, DropdownButton, MenuItem, NavItem, ListGroup,
    ListGroupItem, Badge, PanelGroup, Tabs, Tab
} from 'react-bootstrap';
import * as Utils from '../../api/utils.js';
import MarkdownEditorX from '../element/MarkdownEditorX.js';
import * as DocumentationActions from '../../actions/documentationActions.js';
import * as ServerActions from '../../actions/serverActions.js';

class FormDocument extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filter: '',
            projectCurrentDoc: {},
            currentSectionName: 'overview',
            isModified: false
        };
        this.scrollToTop = false;
        this.handleSectionSelect = this.handleSectionSelect.bind(this);
        this.handleSaveChanges = this.handleSaveChanges.bind(this);
        this.handleChangeFind = this.handleChangeFind.bind(this);
        this.handleClearFind = this.handleClearFind.bind(this);
        this.handleMarkdownChange = this.handleMarkdownChange.bind(this);
    }

    componentDidUpdate(){
        if(this.scrollToTop){
            $('html').animate(
                { scrollTop: 0 },
                300
            );
            this.scrollToTop = false;
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.projectDoc){
            this.setState({
                projectCurrentDoc: nextProps.projectDoc
            });

        }
    }

    componentDidMount(){
        this.props.invokeServerApi('readProjectDocument', {}, [DocumentationActions.SET_PROJECT_DOCUMENT]);
    }

    handleSectionSelect(e){
        e.preventDefault();
        e.stopPropagation();
        var section = e.currentTarget.attributes['data-section-key'].value;
        this.scrollToTop = true;
        this.setState({
            currentSectionName: section
        });
    }

    handleSaveChanges(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.invokeServerApi('writeProjectDocument',
            {projectDocument : this.state.projectCurrentDoc},
            []
        );
        this.setState({
            isModified: false
        });
    }

    handleChangeFind(e){
        var value = this.refs.inputElement.getValue();
        var newState = {
            filter: value
        };
        this.setState(newState);
    }

    handleClearFind(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({ filter: '' });
    }

    handleMarkdownChange(markdownValue){
        let { projectCurrentDoc, currentSectionName } = this.state;
        if(currentSectionName === 'overview'){
            projectCurrentDoc.overview.markdown = markdownValue;
        } else {
            projectCurrentDoc.components[currentSectionName].markdown = markdownValue;
        }
        this.setState({
            projectCurrentDoc: projectCurrentDoc,
            isModified: true
        });
    }

    render() {

        let _filter = this.state.filter ? this.state.filter.toUpperCase() : null;
        let componentSections = [];
        let { projectCurrentDoc: { components, overview }, currentSectionName } = this.state;
        if(components){
            _.forOwn(components, function(component, componentName) {
                if(_filter){
                    if(componentName.toUpperCase().indexOf(_filter) >= 0){
                        componentSections.push(
                            <ListGroupItem key={componentName}
                                           style={{position: 'relative', cursor: 'pointer'}}
                                           data-section-key={componentName}
                                           href="#"
                                           onClick={this.handleSectionSelect}>
                                <span>{Utils.trimComponentName(componentName)}</span>
                            </ListGroupItem>
                        );
                    }
                } else {
                    componentSections.push(
                        <ListGroupItem key={componentName}
                                       style={{position: 'relative', cursor: 'pointer'}}
                                       data-section-key={componentName}
                                       href="#"
                                       onClick={this.handleSectionSelect}>
                            <span>{Utils.trimComponentName(componentName)}</span>
                        </ListGroupItem>
                    );
                }

            }.bind(this));
        }
        let markdownSource = '';
        if(currentSectionName === 'overview' && overview){
            markdownSource = overview.markdown;
        } else if(components) {
            markdownSource = components[currentSectionName].markdown;
        }
        return (
            <div>
                <Grid fluid={true}>
                    <Row>
                        <Col xs={10}>
                            {alert}
                            <h3 style={{marginBottom: '1em'}}><span>Project documentation </span><small>use markdown to edit the content</small></h3>
                        </Col>
                        <Col xs={2}>
                            <Button
                                className='pull-right'
                                bsStyle={this.state.isModified ? 'success' : 'default'} style={{marginTop: '1em'}}
                                onClick={this.handleSaveChanges}>
                                Save changes
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={3}>
                            <ListGroup fill={true}>
                                <ListGroupItem key={'component'}
                                               style={{position: 'relative', cursor: 'pointer'}}
                                               data-section-key={'overview'}
                                               href="#"
                                               onClick={this.handleSectionSelect}>
                                    <span>Overview</span>
                                </ListGroupItem>
                            </ListGroup>
                            <Input
                                ref='inputElement'
                                type={ 'text'}
                                placeholder={ 'Filter...'}
                                value={this.state.filter}
                                onChange={this.handleChangeFind}
                                buttonAfter={ <Button onClick={this.handleClearFind}
                                          bsStyle={ 'default'}>
                                    <span className={ 'fa fa-times'}></span>
                                  </Button>
                                }/>
                            <ListGroup fill={true}>
                                {componentSections}
                            </ListGroup>
                        </Col>
                        <Col xs={9}>
                            <h4 className='text-center'>
                                {currentSectionName === 'overview' ? 'Project overview' : currentSectionName}
                            </h4>
                            <MarkdownEditorX
                                sourceName={currentSectionName}
                                markdownSource={markdownSource}
                                onMarkdownChange={this.handleMarkdownChange}/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }

}

function mapStateToProps(state) {
    const { documentation } = state;
    return {
        projectDoc: documentation.projectDoc
    };
}

let mappedActions = Object.assign({}, DocumentationActions,
    {
        invokeServerApi: ServerActions.invoke
    }
);

export default connect(
    mapStateToProps,
    mappedActions
)(FormDocument);

