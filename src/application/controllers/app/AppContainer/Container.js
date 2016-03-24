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
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import { componentModel } from './selectors.js';
import * as actions from './actions.js';

import { Navbar, Nav, NavItem } from 'react-bootstrap';

import Desk from '../../workspace/Desk';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        const { getProjectInfo } = this.props;
        getProjectInfo();
    }

    render() {

        const { componentModel: {packageConfig, projectDirectoryStatus, projectData, workspaceMode} } = this.props;

        let content = null;
        if(workspaceMode === 'desk'){
            content = (<Desk />);
        } else {
            content = (
                <Navbar
                    staticTop={true}
                    fixedTop={true}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <div className='umy-logo' style={{position: 'absolute', left: 'calc(50% - 20px)', top: '0'}}></div>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Navbar.Text>
                            <span>Structor</span>
                            <span className='text-muted' style={{marginLeft: '0.2em'}}>{packageConfig.version}</span>
                        </Navbar.Text>
                        <Nav pullRight={true}>
                            <NavItem href="https://groups.google.com/forum/#!forum/structor-forum" target="_blank">
                                <span className="fa fa-comments-o fa-fw"></span>&nbsp;Forum
                            </NavItem>
                            <NavItem href="https://www.facebook.com/groups/1668757740011916/" target="_blank">
                                <span className='fa fa-facebook-square fa-fw'></span>&nbsp;Group
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            );
        }

        return (
            <div style={{overflow: 'hidden'}}>
                <div ref='appBody' style={{position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', overflow: 'auto'}}>
                    {content}
                </div>
            </div>
        );
    }
}

export default connect(
    createStructuredSelector({ componentModel }),  dispatch => bindActionCreators(actions, dispatch)
)(Container)

