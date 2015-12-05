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

import {
    Modal, Button
} from 'react-bootstrap';

import * as ModalProxySetupActions from '../../actions/modalProxySetupActions.js';

import ProxyInput from '../element/ProxyInput.js';

class ModalProxySetup extends Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleClose(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.hideModalProxySetup();
    }

    handleSave(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.saveModalProxySetup(this.refs.urlInputElement.getUrlValue());
    }

    render(){
        return (
            <Modal show={this.props.isOpen}
                   onHide={this.props.hideModalProxySetup}
                   dialogClassName='umy-modal-overlay'
                   backdrop={true}
                   keyboard={true}
                   bsSize='small'
                   ref='dialog'
                   animation={true}>
                <Modal.Header closeButton={true} aria-labelledby='contained-modal-title'>
                    <Modal.Title id='contained-modal-title'>Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProxyInput ref='urlInputElement' label='Proxy:' urlValue={this.props.urlValue}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose}>Cancel</Button>
                    <Button onClick={this.handleSave} bsStyle="primary">Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }

}


ModalProxySetup.defaultProps = {
    onHide: null
};


function mapStateToProps(state) {
    const { modalProxySetup } = state;
    return {
        isOpen: modalProxySetup.isOpen,
        urlValue: modalProxySetup.urlValue
    };
}

export default connect(
    mapStateToProps,
    ModalProxySetupActions
)(ModalProxySetup);

