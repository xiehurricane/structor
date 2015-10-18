import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, Button, Nav, CollapsibleNav,
    Navbar, DropdownButton, MenuItem, NavItem } from 'react-bootstrap';

import * as ServerActions from '../../actions/serverActions.js';
import * as AppActions from '../../actions/applicationActions.js';

import GlobalOverlay from '../element/GlobalOverlay.js';
import MessageOverlay from '../element/MessageOverlay.js';
import FormBrowseGallery from './FormBrowseGallery.js';
import ModalComponentEditor from '../modal/ModalComponentEditor.js';
import ModalComponentGenerator from '../modal/ModalComponentGenerator.js';
import ModalComponentVariant from '../modal/ModalComponentVariant.js';
import ModalPageInfo from '../modal/ModalPageInfo.js';
import ModalProxySetup from '../modal/ModalProxySetup.js';
import FormStart from './FormStart.js';
import Desk from '../desk/Desk.js';

class Application extends Component {

    constructor(props) {
        super(props);
        this.handleGoHome = this.handleGoHome.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    componentDidMount(){
        this.props.invokeServerApi('checkProjectDir', {}, [ServerActions.DATA_PROJECT_DIR_STATUS]);
        this.props.invokeServerApi('getPackageConfig', {}, [ServerActions.DATA_PACKAGE_CONFIG]);
        this.props.invokeServerApi('loadUserProfile', {}, [ServerActions.DATA_USER_PROFILE], null, true);
        //this.props.setStage('start');
    }

    handleGoHome(e){
        e.stopPropagation();
        e.preventDefault();
    }

    handleLogout(e){
        e.stopPropagation();
        e.preventDefault();
    }

    handleLogin(e){
        e.stopPropagation();
        e.preventDefault();
    }

    render() {

        const { userName, stage, packageVersion, projectDirectoryStatus } = this.props;

        // -- Navigation Bar -------------------------------------------------------------------------------------------
        var navBar = (
            <Navbar
                staticTop={true}
                fixedTop={true} toggleNavKey={0}>
                <div className='umy-logo' style={{position: 'absolute', left: 'calc(50% - 20px)', top: '0'}}></div>
                <CollapsibleNav eventKey={0}>
                    <Nav navbar>
                        <div style={{display: 'table'}}>
                            <div style={{display: 'table-row'}}>
                                <div style={{display: 'table-cell', verticalAlign: 'middle', paddingLeft: '0.5em', paddingRight: '0.5em', paddingTop: '0.5em', paddingBottom: '0.5em'} }>
                                    <p style={{whiteSpace: 'nowrap'}} className={'text-left'}>
                                        <span>Structor</span>
                                        <span className='text-muted' style={{marginLeft: '0.2em'}}>{packageVersion}</span>
                                    </p>
                                </div>
                                <div style={{display: 'table-cell', verticalAlign: 'middle', paddingLeft: '0.5em', paddingRight: '0.5em', paddingTop: '0.5em', paddingBottom: '0.5em', width: '10%'} }></div>
                            </div>
                        </div>
                    </Nav>
                    <Nav navbar right={true}>
                        <NavItem href="https://groups.google.com/forum/#!forum/structor-forum" target="_blank">
                            <span className="fa fa-comments-o fa-fw"></span>&nbsp;Forum
                        </NavItem>
                        <NavItem href="https://www.facebook.com/groups/1668757740011916/" target="_blank">
                            <span className='fa fa-facebook-square fa-fw'></span>&nbsp;Group
                        </NavItem>
                    </Nav>
                </CollapsibleNav>
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
        setStage: AppActions.setApplicationStage
    }
)(Application);
