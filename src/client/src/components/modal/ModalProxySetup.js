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

