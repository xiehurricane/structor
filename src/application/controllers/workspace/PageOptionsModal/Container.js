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

import { Modal, Tabs, Tab, Button } from 'react-bootstrap';
import { PageComponentForm } from '../../../views';

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleClose(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.hideModal();
    }

    handleSave(e){
        e.stopPropagation();
        e.preventDefault();
        const { changePageOptions, deskPageModel } = this.props;
        const options = this.refs.formPageName.getOptions();
        changePageOptions({
            ...options,
            currentPagePath: deskPageModel.currentPagePath,
            currentPageName: deskPageModel.currentPageName
        });
    }

    render(){
        const { componentModel, deskPageModel, hideModal } = this.props;
        let tabPanes = [];
        tabPanes.push(
            <Tab
                key={tabPanes.length + 1}
                eventKey={tabPanes.length + 1}
                title='Page component'>
                <PageComponentForm
                    ref="formPageName"
                    pageName={deskPageModel.currentPageName}
                    pagePath={deskPageModel.currentPagePath} />
            </Tab>
        );

        return (
            <Modal show={componentModel.show}
                   onHide={hideModal}
                   dialogClassName='umy-modal-overlay'
                   backdrop={true}
                   keyboard={true}
                   bsSize='large'
                   ref='dialog'
                   animation={true}>
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

export default connect(modelSelector, containerActions)(Container);

