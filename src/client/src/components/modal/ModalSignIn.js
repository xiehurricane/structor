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

    handleClose(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.hideModalSignIn();
    }

    handleSignIn(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.signIn(this.refs.emailElement.getValue(),
            this.refs.passwordElement.getValue(),
            this.refs.staySignedElement.getValue());
        //this.props.saveModalProxySetup(this.refs.urlInputElement.getUrlValue());
    }

    render() {
        return (
            <Modal show={this.props.isOpen}
                   onHide={this.props.hideModalSignIn}
                   dialogClassName='umy-modal-overlay'
                   backdrop={true}
                   keyboard={true}
                   bsSize='large'
                   ref='dialog'
                   animation={true}>
                <Modal.Body>
                    <h4 className='text-center' style={{margin: '2em 0 2em 0'}}>Sign in to Structor Market</h4>
                    <form>
                        <table style={{width: '100%'}}>
                            <tbody>
                            <tr>
                                <td style={{width: '30%'}}></td>
                                <td style={{verticalAlign: 'middle'}}>
                                    <InputTextStateful type="text"
                                                       ref='emailElement'
                                                       label='E-mail'
                                                       placeholder="Enter e-mail address"/>
                                </td>
                                <td style={{width: '30%', verticalAlign: 'middle', padding: '0.5em 0 0.5em 1em'}}>
                                    <p><a href={window.serviceUrl + '/sign-up'} target="_blank"><span>Create new account</span></a></p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{width: '30%'}}></td>
                                <td style={{verticalAlign: 'middle'}}>
                                    <InputTextStateful type="password"
                                                       ref='passwordElement'
                                                       label='Password'
                                                       placeholder="Enter password"/>
                                </td>
                                <td style={{width: '30%', verticalAlign: 'middle', padding: '0.5em 0 0.5em 1em'}}>
                                    <p><a href={window.serviceUrl + '/password-recover-request'} target="_blank"><span>Forgot password?</span></a></p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{width: '30%'}}></td>
                                <td style={{paddingTop: '0.5em'}}>
                                    <CheckboxStateful id="staySignedElement" ref="staySignedElement" value={true}/>
                                    <label style={{marginLeft: '0.5em', cursor: 'pointer'}} htmlFor="staySignedElement">Stay
                                        signed in</label>
                                </td>
                                <td style={{width: '30%'}}></td>
                            </tr>
                            <tr>
                                <td style={{width: '30%'}}></td>
                                <td style={{textAlign: 'center', padding: '2em 0 3em 0'}}>
                                    <Button type="submit" onClick={this.handleSignIn} bsStyle="primary">Sign In</Button>
                                    <span>&nbsp;</span>
                                    <span>&nbsp;</span>
                                    <Button onClick={this.handleClose}>Cancel</Button>
                                </td>
                                <td style={{width: '30%'}}></td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
                </Modal.Body>
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

