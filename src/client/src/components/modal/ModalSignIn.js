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

import * as ModalSignInActions from '../../actions/modalSignInActions.js';

import InputTextStateful from '../element/InputTextStateful.js';
import CheckboxStateful from '../element/CheckboxStateful.js';

class ModalSignIn extends Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
    }

    handleClose(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.hideModalSignIn();
    }

    handleSignIn(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.signIn(this.refs.emailElement.getValue(),
            this.refs.passwordElement.getValue(),
            this.refs.staySignedElement.getValue());
        //this.props.saveModalProxySetup(this.refs.urlInputElement.getUrlValue());
    }

    render(){
        return (
            <Modal show={this.props.isOpen}
                   onHide={this.props.hideModalSignIn}
                   dialogClassName='umy-modal-overlay'
                   backdrop={true}
                   keyboard={true}
                   bsSize='small'
                   ref='dialog'
                   animation={true}>
                <form>
                <Modal.Header closeButton={true} aria-labelledby='contained-modal-title'>
                    <Modal.Title id='contained-modal-title'>Sign in to Structor Market</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputTextStateful type="text"
                                       ref='emailElement'
                                       label='E-mail'
                                       placeholder="Enter e-mail address"/>
                    <InputTextStateful type="password"
                                       ref='passwordElement'
                                       label='Password'
                                       placeholder="Enter password"/>
                    <CheckboxStateful id="staySignedElement" ref="staySignedElement" value={true} />
                    <label style={{marginLeft: '0.5em', cursor: 'pointer'}} htmlFor="staySignedElement">Stay signed in</label>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose}>Cancel</Button>
                    <Button type="submit" onClick={this.handleSignIn} bsStyle="primary">Sign In</Button>
                </Modal.Footer>
                </form>
            </Modal>
        );
    }

}


ModalSignIn.defaultProps = {
    onHide: null
};


function mapStateToProps(state) {
    const { modalSignIn } = state;
    return {
        isOpen: modalSignIn.isOpen
    };
}

export default connect(
    mapStateToProps,
    ModalSignInActions
)(ModalSignIn);

