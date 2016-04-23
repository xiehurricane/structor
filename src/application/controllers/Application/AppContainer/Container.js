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
import { Grid, Row, Col, Panel, Button, Nav, CollapsibleNav,
    Navbar, DropdownButton, MenuItem, NavItem } from 'react-bootstrap';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
    }

    render() {

        const { stage, packageVersion, projectDirectoryStatus } = this.props;

        // -- Navigation Bar -------------------------------------------------------------------------------------------
        var navBar = (
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
                        <span className='text-muted' style={{marginLeft: '0.2em'}}>{packageVersion}</span>
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

        let content = null;
        if(stage === 'start'){
            if(projectDirectoryStatus === 'dir-is-empty'){
                content = (
                    <FormBrowseGallery />
                );
            } else if(projectDirectoryStatus === 'ready-to-go') {
                navBar = null;
                content = (
                    <Desk />
                );
            } else {
                content = (
                    <FormStart />
                );
            }
        }

        return (
            <div style={{overflow: 'hidden'}}>
                <div ref='appBody' style={{position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', overflow: 'auto'}}>
                    {navBar}
                    {content}
                </div>
                <ModalComponentEditor />
                <ModalComponentGenerator />
                <ModalComponentVariant />
                <ModalPageInfo />
                <ModalProxySetup />
                <MessageOverlay />
                <GlobalOverlay />
                <ModalSignIn />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { application, server } = state;
    return {
        stage: application.stage,
        packageVersion: server.packageVersion,
        userName: server.userProfile.userName,
        projectDirectoryStatus: server.projectDirectoryStatus
    };
}

export default connect(
    mapStateToProps,
    {
        invokeServerApi: ServerActions.invoke,
        setStage: AppActions.setApplicationStage,
        signIn: AppActions.signIn
    }
)(Application);
