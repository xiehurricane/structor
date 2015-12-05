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


import validator from 'validator';
import marked from 'marked';

import {
    Modal, Input, ListGroup, ListGroupItem,
    Badge, PanelGroup, Tabs, Tab,
    Grid, Row, Col, Panel, Button, Nav,
    CollapsibleNav, Navbar, DropdownButton,
    MenuItem, NavItem
} from 'react-bootstrap';

import FormCodeComponentEditor from './FormCodeComponentEditor.js';
import FormPropsComponentEditor from './FormPropsComponentEditor.js';

import * as ModalComponentActions from '../../actions/modalComponentEditorActions.js';

class ModalComponentEditor extends Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCreateComponent = this.handleCreateComponent.bind(this);
    }

    componentDidMount(){
        //console.log('ModalComponentEditor did mount');
    }

    componentDidUpdate(){
        //console.log('ModalComponentEditor did update');
    }

    componentWillUpdate(nextProps, nextState){
        //console.log('ModalComponentEditor will be updated');
    }

    handleClose(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.hideModalComponentEditor();
        //ModalComponentEditorActions.hideModal();
    }

    handleSave(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.saveComponentOptions({
            propsScript: this.refs.componentPropsEditor ? this.refs.componentPropsEditor.getPropsScript() : null,
            componentText: this.refs.componentTextInput ? this.refs.componentTextInput.getValue() : null,
            sourceCode: this.refs.componentSourceCodeEditor ? this.refs.componentSourceCodeEditor.getComponentScript() : null,
            componentName: this.props.componentName,
            sourceFilePath: this.props.sourceFilePath
        });
    }

    handleCreateComponent(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.startGenerateComponent();
    }

    render(){
        var containerStyle={
            marginTop: '1em',
            width: '100%'
        };
        var tabPanes = [];

        if(!!this.props.componentText){
            tabPanes.push(
                <Tab key={'componentText'} eventKey={tabPanes.length + 1} title='Component Text'>
                    <div className='container-fluid' style={containerStyle}>
                        <div className='row'>
                            <div className='col-xs-12'>
                                <Input
                                    type="textarea"
                                    placeholder="Enter text"
                                    defaultValue={this.props.componentText}
                                    ref="componentTextInput"
                                    style={{width: '100%', height: '400px'}}/>
                            </div>
                        </div>
                    </div>
                </Tab>
            );
        }

        tabPanes.push(
            <Tab key={'properties'} eventKey={tabPanes.length + 1} title='Properties'>
                <FormPropsComponentEditor
                    ref='componentPropsEditor'
                    style={containerStyle}
                    propsScript={this.props.propsScript}
                    editorStyle={{height: '400px', width: '100%'}}/>
            </Tab>
        );

        if(this.props.sourceCode){
            tabPanes.push(
                <Tab key={'component'} eventKey={tabPanes.length + 1} title='Component'>
                    <FormCodeComponentEditor
                        sourceCode={this.props.sourceCode}
                        ref='componentSourceCodeEditor'
                        style={containerStyle}
                        sourceFilePath={this.props.sourceFilePath}
                        editorStyle={{height: '400px', width: '100%'}}
                        />
                </Tab>
            );
        } else {
            tabPanes.push(
                <Tab key={'component'} eventKey={tabPanes.length + 1} title='Component'>
                    <div style={{height: '400px', width: '100%'}}>
                        <div style={{height: '100%', width: '100%', marginTop: '1em'}}>
                            <table style={{ width: '100%'}}>
                                <tbody>
                                <tr>
                                    <td style={{width: '20%'}}></td>
                                    <td style={{height: '300px', textAlign: 'center', verticalAlign: 'middle'}}>
                                        <p>
                                            <Button block={false}
                                                    onClick={this.handleCreateComponent}>
                                                <span>Generate Component's source code</span>
                                            </Button>
                                        </p>
                                    </td>
                                    <td style={{width: '20%'}}></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Tab>
            );
        }
        if(this.props.documentMarkdown){
            tabPanes.push(
                <Tab key={'readMe'} eventKey={tabPanes.length + 1} title='Read Me'>
                    <div style={{height: '400px', marginTop: '1em', width: '100%', overflow: 'auto'}}>
                        <div style={{width: '100%', padding: '0 2em 0 2em'}}>
                            <div dangerouslySetInnerHTML={{__html: marked(this.props.documentMarkdown)}} >
                            </div>
                        </div>
                    </div>
                </Tab>
            );
        }

        return (
            <Modal show={this.props.isOpen}
                   onHide={this.props.hideModalComponentEditor}
                   dialogClassName='umy-modal-overlay'
                   backdrop={true}
                   keyboard={true}
                   bsSize='large'
                   ref='dialog'
                   animation={true}>
                {/*<Modal.Header closeButton={false} aria-labelledby='contained-modal-title'>
                 <Modal.Title id='contained-modal-title'></Modal.Title>
                 </Modal.Header>*/}
                <Modal.Body>
                    <Tabs defaultActiveKey={1}>
                        {tabPanes}
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose}>Cancel</Button>
                    <Button onClick={this.handleSave} bsStyle="primary">Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }

}

ModalComponentEditor.defaultProps = {
    onHide: null
};

function mapStateToProps(state) {
    const { modalComponentEditor } = state;
    return {
        isOpen: modalComponentEditor.isOpen,
        componentText: modalComponentEditor.componentText,
        propsScript: modalComponentEditor.propsScript,
        sourceCode: modalComponentEditor.sourceCode,
        componentName: modalComponentEditor.componentName,
        componentGroup: modalComponentEditor.componentGroup,
        documentMarkdown: modalComponentEditor.documentMarkdown,
        sourceFilePath: modalComponentEditor.sourceFilePath
    };
}

//function mapDispatchToProps(dispatch) {
//    return {
//        //onIncrement: () => dispatch(increment())
//    };
//}

export default connect(
    mapStateToProps,
    ModalComponentActions
)(ModalComponentEditor);

