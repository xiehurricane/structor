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

import validator from 'validator';

import {
    Modal, Input, ListGroup, ListGroupItem,
    Badge, PanelGroup, TabbedArea, TabPane,
    Grid, Row, Col, Panel, Button, Nav,
    CollapsibleNav, Navbar, DropdownButton,
    MenuItem, NavItem
} from 'react-bootstrap';


class FormPageName extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pageName: this.props.pageName,
            pagePath: this.props.pagePath,
            pageTitle: this.props.pageTitle
        };
        this.validatePageName = this.validatePageName.bind(this);
        this.validatePagePath = this.validatePagePath.bind(this);
        this.handlePageNameChange = this.handlePageNameChange.bind(this);
        this.handlePagePathChange = this.handlePagePathChange.bind(this);
        this.handlePageTitleChange = this.handlePageTitleChange.bind(this);
    }


    getOptions() {
        return {
            pageName: this.state.pageName,
            pagePath: this.state.pagePath,
            pageTitle: this.state.pageTitle,
            makeIndexRoute: this.refs.pageIndexCheckbox.checked
        };
    }

    validatePageName() {
        const { pageName } = this.state;
        if (pageName && pageName.length > 0 && validator.isAlphanumeric(pageName)) {
            return 'has-success';
        } else {
            return 'has-error';
        }
    }

    validatePagePath() {
        const { pagePath } = this.state;
        if (pagePath && pagePath.length > 0 && pagePath.charAt(0) === '/') {
            return 'has-success';
        } else {
            return 'has-error';
        }
    }

    handlePageNameChange() {
        this.setState({
            pageName: this.refs.pageNameInput.value
        });
    }

    handlePagePathChange() {
        this.setState({
            pagePath: this.refs.pagePathInput.value
        });
    }

    handlePageTitleChange() {
        this.setState({
            pageTitle: this.refs.pageTitleInput.value
        });
    }


    render() {

        return (
            <table style={{width: '100%', height: '400px'}}>
                <tbody>
                <tr>
                    <td style={{width: '20%'}}></td>
                    <td style={{height: '100%', verticalAlign: 'middle'}}>
                        <div className={'form-group ' + this.validatePagePath()}>
                            <label htmlFor='pagePathElement'>Route path:</label>
                            <input id='pagePathElement'
                                   ref='pagePathInput'
                                   className="form-control input-sm"
                                   type="text"
                                   placeholder='Path'
                                   value={this.state.pagePath}
                                   onChange={this.handlePagePathChange}
                                />
                        </div>
                        <div className="form-group text-left">
                            <label htmlFor='pageIndexCheckbox'>
                                <input id='pageIndexCheckbox'
                                       ref='pageIndexCheckbox'
                                       style={{ display: 'inline-block' }}
                                       type="checkbox" />
                                <span>&nbsp;&nbsp;make index route</span>
                            </label>
                        </div>
                        <div className={'form-group ' + this.validatePageName()}>
                            <label htmlFor='pageNameElement'>Component name:</label>
                            <input id='pageNameElement'
                                   ref='pageNameInput'
                                   className="form-control input-sm"
                                   type="text"
                                   placeholder='Component name'
                                   value={this.state.pageName}
                                   onChange={this.handlePageNameChange}
                                />
                        </div>
                        {/*<div className={'form-group'}>
                            <label htmlFor='pageTitleElement'>Page title:</label>
                            <input id='pageTitleElement'
                                   ref='pageTitleInput'
                                   className="form-control input-sm"
                                   type="text"
                                   placeholder='Title value'
                                   value={this.state.pageTitle}
                                   onChange={this.handlePageTitleChange}
                                />
                        </div>*/}
                        <Panel>
                            <p>Route path possible values:</p>
                            <p><strong>/hello </strong><small>// matches /hello</small></p>
                            <p><strong>/hello/:name </strong><small>// matches /hello/michael and /hello/ryan</small></p>
                        </Panel>
                    </td>
                    <td style={{width: '20%'}}></td>
                </tr>
                </tbody>
            </table>
        );

    }

}

export default FormPageName;
