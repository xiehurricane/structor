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
import { Grid, Row, Col, Panel, Button, Nav, CollapsibleNav,
    Navbar, DropdownButton, MenuItem, NavItem } from 'react-bootstrap';

import * as DeskPageActions from '../../actions/deskPageActions.js';

import OverlayButtons from './OverlayButtons.js';
import SearchComponentName from './SearchComponentName.js';

class OverlayTreeviewItem extends Component {

    constructor(props) {
        super(props);
        this.handleCloseQuickAppend = this.handleCloseQuickAppend.bind(this);
        this.handleStartQuickAppend = this.handleStartQuickAppend.bind(this);
        this.handleSubmitQuickAppend = this.handleSubmitQuickAppend.bind(this);
    }

    handleCloseQuickAppend() {
        if(this.props.onStopQuickPaste){
            this.props.onStopQuickPaste();
        }
    }

    handleStartQuickAppend(appendMode) {
        if(this.props.onStartQuickPaste){
            this.props.onStartQuickPaste(appendMode);
        }
    }

    handleSubmitQuickAppend(value) {
        if(this.props.onQuickPaste){
            this.props.onQuickPaste(value, this.props.quickPasteModeInModelByName);
        }
    }

    render() {
        if (this.props.quickPasteModeInModelByName) {
            return (
                <div style={{display: 'table', width: '100%'}}>
                    <div style={{display: 'table-row', width: '100%'}}>
                        <div style={{ display: 'table-cell', width: '33%'}}></div>
                        <div style={{display: 'table-cell', width: '34%'}}>
                            <SearchComponentName
                                method={this.props.quickPasteModeInModelByName}
                                style={{textAlign: 'left', width: '300'}}
                                onChangeMethod={ mode => this.handleStartQuickAppend(mode) }
                                onClose={ this.handleCloseQuickAppend }
                                onChangeValue={ this.handleSubmitQuickAppend }/>
                        </div>
                        <div style={{ display: 'table-cell', width: '33%'}}></div>
                    </div>
                </div>
            );

        } else {

            const { searchResult } = this.props;

            var overlayModel = {
                buttons: []
            };

            if (searchResult.foundProp === '/!#child') {

                if (this.props.isFullFledged) {
                    overlayModel.buttons.push(
                        {
                            label: 'Before',
                            btnClass: 'btn-default',
                            onClick: () => this.handleStartQuickAppend('addBefore'),
                            tooltip: 'Append quickly before selected'
                        });
                    overlayModel.buttons.push(
                        {
                            label: 'First',
                            btnClass: 'btn-default',
                            onClick: () => this.handleStartQuickAppend('insertFirst'),
                            tooltip: 'Insert quickly as first in selected'
                        });
                    overlayModel.buttons.push(
                        {
                            label: 'Replace',
                            btnClass: 'btn-default',
                            onClick: () => this.handleStartQuickAppend('replace'),
                            tooltip: 'Replace quickly selected'
                        });
                    overlayModel.buttons.push(
                        {
                            label: 'Wrap',
                            btnClass: 'btn-default',
                            onClick: () => this.handleStartQuickAppend('wrap'),
                            tooltip: 'Wrap quickly selected'
                        });
                    overlayModel.buttons.push(
                        {
                            label: 'Last',
                            btnClass: 'btn-default',
                            onClick: () => this.handleStartQuickAppend('insertLast'),
                            tooltip: 'Insert quickly as last in selected'
                        });
                    overlayModel.buttons.push(
                        {
                            label: 'After',
                            btnClass: 'btn-default',
                            onClick: () => this.handleStartQuickAppend('addAfter'),
                            tooltip: 'Append quickly after selected'
                        });
                }
                overlayModel.buttons.push(
                    {
                        icon: 'fa-arrow-up',
                        btnClass: 'btn-default',
                        onClick: this.props.onMoveUp,
                        tooltip: 'Move component up within parent'
                    });
                overlayModel.buttons.push(
                    {
                        icon: 'fa-arrow-down',
                        btnClass: 'btn-default',
                        onClick: this.props.onMoveDown,
                        tooltip: 'Move component up within parent'
                    });
            }
            overlayModel.buttons.push(
                {
                    icon: 'fa-cut',
                    btnClass: 'btn-default',
                    onClick: this.props.onCut,
                    tooltip: 'Cut component into clipboard'
                });
            overlayModel.buttons.push(
                {
                    icon: 'fa-clipboard',
                    btnClass: 'btn-default',
                    onClick: this.props.onCopy,
                    tooltip: 'Copy component into clipboard'
                });
            overlayModel.buttons.push(
                {
                    icon: 'fa-copy',
                    btnClass: 'btn-default',
                    onClick: this.props.onDuplicate,
                    tooltip: 'Duplicate component'
                });
            overlayModel.buttons.push(
                {
                    icon: 'fa-trash-o',
                    btnClass: 'btn-default',
                    onClick: this.props.onDelete,
                    tooltip: 'Remove component from page'
                });
            overlayModel.buttons.push(
                {
                    icon: 'fa-gears',
                    btnClass: 'btn-default',
                    onClick: this.props.onOptions,
                    tooltip: 'Show component\'s options'
                });
            return (
                <OverlayButtons model={overlayModel} onClose={this.props.onClose}/>
            );
        }
    }
}

OverlayTreeviewItem.defaultProps = {
    isFullFledged: true,
    onMoveUp: null,
    onMoveDown: null,
    onCut: null,
    onCopy: null,
    onDuplicate: null,
    onDelete: null,
    onOptions: null,
    quickPasteModeInModelByName: null
};

export default OverlayTreeviewItem;
