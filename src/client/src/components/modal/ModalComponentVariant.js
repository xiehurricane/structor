import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
    Modal, Input, ListGroup, ListGroupItem,
    Badge, PanelGroup, Tabs, Tab,
    Grid, Row, Col, Panel, Button, Nav,
    CollapsibleNav, Navbar, DropdownButton,
    MenuItem, NavItem
} from 'react-bootstrap';

import * as ModalComponentVariantActions from '../../actions/modalComponentVariantActions.js';

import WizardComponentVariant from '../wizard/WizardComponentVariant.js';

class ModalComponentVariant extends Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.hideModalComponentVariant();
    }

    render(){
        let wizardElement = this.props.isOpen ? <WizardComponentVariant /> : null;
        return (
            <Modal show={this.props.isOpen}
                   onHide={this.props.hideModalComponentVariant}
                   dialogClassName='umy-modal-overlay'
                   backdrop={true}
                   keyboard={true}
                   bsSize='small'
                   ref='dialog'
                   animation={true}>
                {/*<Modal.Header closeButton={false} aria-labelledby='contained-modal-title'>
                 <Modal.Title id='contained-modal-title'>Generate component's source code</Modal.Title>
                 </Modal.Header>*/}
                <Modal.Body>
                    <div>
                        {wizardElement}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ModalComponentVariant.defaultProps = {
    onHide: null
};

function mapStateToProps(state) {
    const { modalComponentVariant } = state;
    return {
        isOpen: modalComponentVariant.isOpen
    };
}

//function mapDispatchToProps(dispatch) {
//    return {
//        //onIncrement: () => dispatch(increment())
//    };
//}

export default connect(
    mapStateToProps,
    ModalComponentVariantActions
)(ModalComponentVariant);

