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
        this.state = {
            quickAppend: false
        };
        this.handleCloseQuickAppend = this.handleCloseQuickAppend.bind(this);
        this.handleSubmitQuickAppend = this.handleSubmitQuickAppend.bind(this);
    }

    handleCloseQuickAppend() {
        this.setState({
            quickAppend: false,
            command: null,
            umyid: null
        });
    }

    handleSubmitQuickAppend(value) {
        if(this.props.onQuickPaste){
            this.props.onQuickPaste(value, this.state.command);
        }
        //PanelAvailableComponentsActions.quickAppend(
        //    { componentId: value }, this.state.command, this.state.umyid
        //);
    }

    render() {
        if (this.state.quickAppend) {
            return (
                <div style={{display: 'table', width: '100%'}}>
                    <div style={{display: 'table-row', width: '100%'}}>
                        <div style={{ display: 'table-cell', width: '33%'}}></div>
                        <div style={{display: 'table-cell', width: '34%'}}>
                            <SearchComponentName
                                method={this.state.command}
                                style={{textAlign: 'left', width: '300'}}
                                onClose={ this.handleCloseQuickAppend }
                                onChangeValue={ this.handleSubmitQuickAppend }/>
                        </div>
                        <div style={{ display: 'table-cell', width: '33%'}}></div>
                    </div>
                </div>
            );

        } else {

            //var domNodeId = this.props.selectedUmyId;
            //var searchResult = this.props.searchResult;
            const { selectedUmyId, searchResult } = this.props;

            var overlayModel = {
                buttons: []
            };

            if (searchResult.foundProp === '/!#child') {

                if (this.props.isFullFledged) {
                    overlayModel.buttons.push(
                        {
                            label: 'Before',
                            btnClass: 'btn-default',
                            onClick: (function (_nodeId, _this) {
                                return function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    _this.setState({
                                        quickAppend: true,
                                        umyid: _nodeId,
                                        command: 'addBefore'
                                    });
                                }
                            })(selectedUmyId, this),
                            tooltip: 'Append quickly before selected'
                        });
                    overlayModel.buttons.push(
                        {
                            label: 'First',
                            btnClass: 'btn-default',
                            onClick: (function (_nodeId, _this) {
                                return function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    _this.setState({
                                        quickAppend: true,
                                        umyid: _nodeId,
                                        command: 'insertFirst'
                                    });
                                }
                            })(selectedUmyId, this),
                            tooltip: 'Insert quickly as first in selected'
                        });
                    overlayModel.buttons.push(
                        {
                            label: 'Replace',
                            btnClass: 'btn-default',
                            onClick: (function (_nodeId, _this) {
                                return function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    _this.setState({
                                        quickAppend: true,
                                        umyid: _nodeId,
                                        command: 'replace'
                                    });
                                }
                            })(selectedUmyId, this),
                            tooltip: 'Replace quickly selected'
                        });
                    overlayModel.buttons.push(
                        {
                            label: 'Wrap',
                            btnClass: 'btn-default',
                            onClick: (function (_nodeId, _this) {
                                return function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    _this.setState({
                                        quickAppend: true,
                                        umyid: _nodeId,
                                        command: 'wrap'
                                    });
                                }
                            })(selectedUmyId, this),
                            tooltip: 'Wrap quickly selected'
                        });
                    overlayModel.buttons.push(
                        {
                            label: 'Last',
                            btnClass: 'btn-default',
                            onClick: (function (_nodeId, _this) {
                                return function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    _this.setState({
                                        quickAppend: true,
                                        umyid: _nodeId,
                                        command: 'insertLast'
                                    });
                                }
                            })(selectedUmyId, this),
                            tooltip: 'Insert quickly as last in selected'
                        });
                    overlayModel.buttons.push(
                        {
                            label: 'After',
                            btnClass: 'btn-default',
                            onClick: (function (_nodeId, _this) {
                                return function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    _this.setState({
                                        quickAppend: true,
                                        umyid: _nodeId,
                                        command: 'addAfter'
                                    });
                                }
                            })(selectedUmyId, this),
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
    onOptions: null
};

export default OverlayTreeviewItem;
