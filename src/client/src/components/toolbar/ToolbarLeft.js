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
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { saveProject, exportApplication } from '../../actions/applicationActions.js';
import * as DeskActions from '../../actions/deskActions.js';
import { commandReloadPage } from '../../actions/deskPageActions.js';
import { showModalProxySetup } from '../../actions/modalProxySetupActions.js';

class ToolbarLeft extends Component {

    constructor(props) {
        super(props);
        //this.state = { open: props.open };
        this.handlePublishProject = this.handlePublishProject.bind(this);
        this.handleProxySetup = this.handleProxySetup.bind(this);
    }

    handlePublishProject(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    handleProxySetup(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.showModalProxySetup();
    }

    //recreateTooltips(){
    //    let thisDOMNode = ReactDOM.findDOMNode(this);
    //    $(thisDOMNode).find('[data-toggle="tooltip"]').tooltip('destroy');
    //    $(thisDOMNode).find('[data-toggle="tooltip"]').tooltip({delay: { "show": 1300, "hide": 100 }, container: 'body'});
    //}

    componentDidMount(){
        //this.recreateTooltips();
    }

    render(){
        var leftSideStyle = {
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'bottom': 0
        };

        var leftSideStyleInner = {
            'position': 'relative',
            'minWidth': '4em',
            'width': '4em',
            'padding': '0 0.5em 0 0.5em'
        };

        var btnGroupStyle = {
            'width': '100%',
            'textAlign': 'center'
        };

        return (
            <div style={leftSideStyle}>
                <div style={leftSideStyleInner}>
                    <div className="btn-group" style={btnGroupStyle}>
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                            <span className="fa fa-bars" style={{fontSize: 32}} />
                        </a>
                        <ul className="dropdown-menu" role="menu">
                            <li><a href="#" onClick={ () => { this.props.saveProject(); } }>
                                <span className="fa fa-save fa-fw" />&nbsp;Save project</a>
                            </li>
                            <li className="divider" />
                            <li><a href="#" onClick={ () => { this.props.exportApplication(); } }>
                                <span className="fa fa-gift fa-fw" />&nbsp;Export project</a>
                            </li>
                            <li className="divider" />
                            <li><a href="#" onClick={this.handleProxySetup}>
                                <span className="fa fa-gears fa-fw" />&nbsp;Proxy settings</a>
                            </li>
                            <li className="divider" />
                            <li><a href="#" onClick={this.handlePublishProject}>
                                <span className="fa fa-cloud-upload fa-fw" />&nbsp;Publish project</a>
                            </li>
                            <li className="divider" />
                            <li><a href="/structor/docs.html" target="_blank">
                                <span className="fa fa-paperclip fa-flip-vertical fa-fw"></span>&nbsp;Project documentation</a>
                            </li>
                        </ul>
                    </div>

                    <Button
                        bsStyle={this.props.isAvailableComponentsButtonActive ? 'primary' : 'default'}
                        style={{marginTop: '1em', width: '100%'}}
                        disabled={!this.props.isEditMode}
                        onClick={this.props.toggleAvailableComponents}
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Show the list of available components">
                        <span className="fa fa-plus" />
                    </Button>

                    <Button
                        bsStyle={this.props.isComponentsHierarchyButtonActive ? 'primary' : 'default'}
                        style={{marginTop: '0.25em', width: '100%'}}
                        disabled={!this.props.isEditMode}
                        onClick={this.props.toggleComponentsHierarchy}
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Show components' hierarchy on current page">
                        <span className="fa fa-code" />
                    </Button>

                    <Button
                        bsStyle={this.props.isQuickOptionsButtonActive ? 'primary' : 'default'}
                        style={{marginTop: '0.25em', width: '100%'}}
                        disabled={!this.props.isEditMode}
                        onClick={this.props.toggleQuickOptions}
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Show component's quick options panel">
                        <span className="fa fa-paint-brush" />
                    </Button>

                    <Button
                        bsStyle={this.props.isEditMode ? 'primary' : 'default'}
                        style={{marginTop: '1em', width: '100%'}}
                        onClick={this.props.startEditMode}
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Switch to edit page mode">
                        <span className="fa fa-wrench" />
                    </Button>

                    <Button
                        bsStyle={this.props.isLivePreviewMode ? 'primary' : 'default'}
                        style={{marginTop: '0.25em', width: '100%'}}
                        onClick={this.props.startLivePreviewMode}
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Switch to view page mode">
                        <span className="fa fa-hand-pointer-o" />
                    </Button>

                    <Button
                        bsStyle="default"
                        style={{marginTop: '1em', width: '100%'}}
                        onClick={this.props.commandReloadPage}
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Reload current page. State will be lost.">
                        <span className="fa fa-refresh" />
                    </Button>
                    {/*
                    <Button
                        bsStyle={this.props.isDocumentMode ? 'primary' : 'default'}
                        style={{marginTop: '0.25em', width: '100%'}}
                        onClick={this.props.startDocumentMode}
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Open project's documentation">
                        <span className="fa fa-paperclip fa-flip-vertical" />
                    </Button>
                     */}
                    <div style={{marginTop: '0.25em', width: '100%', height: '2em'}} />
                </div>
            </div>
        )
    }

}


function mapStateToProps(state) {
    const { desk } = state;
    return {
        isAvailableComponentsButtonActive: desk.isAvailableComponentsButtonActive,
        isComponentsHierarchyButtonActive: desk.isComponentsHierarchyButtonActive,
        isQuickOptionsButtonActive: desk.isQuickOptionsButtonActive,
        isEditMode: desk.isEditMode,
        isLivePreviewMode: desk.isLivePreviewMode,
        isDocumentMode: desk.isDocumentMode
    };
}

let mappedActions = Object.assign({}, DeskActions,
    {
        showModalProxySetup,
        saveProject,
        exportApplication,
        commandReloadPage
    }
);

export default connect(
    mapStateToProps,
    mappedActions
)(ToolbarLeft);
