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
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { Modal, Button, Alert } from 'react-bootstrap';
import { InputTextStateful, CheckboxStateful } from '../../../views';

class Container extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ''
        };
        this.handleClose = this.handleClose.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
    }

    handleClose(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.hideModal();
        this.props.signInClean();
        this.setState({email: ''});
    }

    handleSignIn(e) {
        e.stopPropagation();
        e.preventDefault();
        this.setState({ email: this.refs.emailElement.getValue() });
        this.props.signIn(
            this.refs.emailElement.getValue(),
            this.refs.passwordElement.getValue(),
            this.refs.staySignedElement.getValue()
        );
    }


    render(){
        const {componentModel: {show}, hideModal, appContainerModel:{authentication: {error}}} = this.props;
        const sideWidth = '10em';
        return (
            <Modal show={show}
                   onHide={() => {hideModal();}}
                   onEntered={() => { this.refs.emailElement.focus(); }}
                   dialogClassName='umy-modal-overlay umy-modal-middlesize'
                   backdrop={true}
                   keyboard={true}
                   bsSize='small'
                   ref='dialog'
                   animation={true}>
                <Modal.Body>
                    <h4 className='text-center' style={{margin: '2em 0 2em 0'}}>Sign in to Structor Market</h4>
                    <form onSubmit={this.handleSignIn}>
                        <table style={{width: '100%'}}>
                            <tbody>
                            { error ? <tr>
                                <td style={{width: sideWidth}}></td>
                                <td style={{verticalAlign: 'middle'}}>
                                    <Alert bsStyle="danger">{error}</Alert>
                                </td>
                                <td style={{width: sideWidth}}>
                                </td>
                            </tr> : null}
                            <tr>
                                <td style={{width: sideWidth}}></td>
                                <td style={{verticalAlign: 'middle'}}>
                                    <InputTextStateful type="text"
                                                       ref="emailElement"
                                                       label="E-mail"
                                                       value={this.state.email}
                                                       placeholder="Enter e-mail address"/>
                                </td>
                                <td style={{width: sideWidth, verticalAlign: 'middle', padding: '0.5em 0 0.5em 1em'}}>
                                    <p><a href={window.serviceUrl + '/sign-up'} target="_blank"><span>Create account</span></a></p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{width: sideWidth}}></td>
                                <td style={{verticalAlign: 'middle'}}>
                                    <InputTextStateful type="password"
                                                       ref="passwordElement"
                                                       label="Password"
                                                       placeholder="Enter password"/>
                                </td>
                                <td style={{width: sideWidth, verticalAlign: 'middle', padding: '0.5em 0 0.5em 1em'}}>
                                    <p><a href={window.serviceUrl + '/password-recover-request'} target="_blank"><span>Forgot password?</span></a></p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{width: sideWidth}}></td>
                                <td style={{paddingTop: '0.5em'}}>
                                    <CheckboxStateful id="staySignedElement"
                                                      ref="staySignedElement"
                                                      value={true}/>
                                    <label style={{marginLeft: '0.5em', cursor: 'pointer'}} htmlFor="staySignedElement">Stay
                                        signed in</label>
                                </td>
                                <td style={{width: sideWidth}}></td>
                            </tr>
                            <tr>
                                <td style={{width: sideWidth}}></td>
                                <td style={{textAlign: 'center', padding: '2em 0 3em 0'}}>
                                    <Button type="submit"
                                            bsStyle="primary">Sign In</Button>
                                    <span>&nbsp;</span>
                                    <span>&nbsp;</span>
                                    <Button onClick={this.handleClose}>Cancel</Button>
                                </td>
                                <td style={{width: sideWidth}}></td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
                </Modal.Body>
            </Modal>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);