import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, Button, Nav, CollapsibleNav,
    Navbar, DropdownButton, MenuItem, NavItem } from 'react-bootstrap';

import * as DeskPageActions from '../../actions/deskPageActions.js';

import OverlayButtons from './OverlayButtons.js';

import * as Utils from '../../api/utils.js';
import * as UtilStore from '../../api/utilStore.js';

class OverlayTreeviewItemPaste extends Component {

    constructor(props) {
        super(props);
    }

    render() {
            let overlayModel = {
                buttons: [
                    {
                        label: 'Before',
                        btnClass: 'btn-default',
                        onClick: this.props.onAddBefore,
                        tooltip: 'Append from clipboard before selected'
                    },
                    {
                        label: 'First',
                        btnClass: 'btn-default',
                        onClick: this.props.onInsertFirst,
                        tooltip: 'Insert from clipboard as first in selected'
                    },
                    {
                        label: 'Wrap',
                        btnClass: 'btn-default',
                        onClick: this.props.onWrap,
                        tooltip: 'Wrap selected with one from clipboard'
                    },
                    {
                        label: 'Replace',
                        btnClass: 'btn-default',
                        onClick: this.props.onReplace,
                        tooltip: 'Replace selected with one from clipboard'
                    },
                    {
                        label: 'Last',
                        btnClass: 'btn-default',
                        onClick: this.props.onInsertLast,
                        tooltip: 'Insert from clipboard as last in selected'
                    },
                    {
                        label: 'After',
                        btnClass: 'btn-default',
                        onClick: this.props.onAddAfter,
                        tooltip: 'Append from clipboard after selected'
                    },
                    {
                        label: 'Cancel',
                        btnClass: 'btn-default',
                        onClick: this.props.onCancel,
                        tooltip: 'Clear clipboard'
                    }
                ]
            };
            return (
                <OverlayButtons model={overlayModel} onClose={this.props.onClose}/>
            );
    }

}

OverlayTreeviewItemPaste.defaultProps = {
    isFullFledged: true,
    onAddBefore: null,
    onInsertFirst: null,
    onWrap: null,
    onReplace: null,
    onInsertLast: null,
    onAddAfter: null,
    onCancel: null
};

export default OverlayTreeviewItemPaste;
