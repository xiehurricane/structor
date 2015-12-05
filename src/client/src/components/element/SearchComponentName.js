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
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, Button, Nav, CollapsibleNav,
    Navbar, DropdownButton, MenuItem, NavItem } from 'react-bootstrap';

import Combobox from 'react-widgets/lib/Combobox';

class SearchComponentName extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
        this.selected = false;
    }


    componentDidMount() {
        var $element = $(ReactDOM.findDOMNode(this.refs.selectElement)).find('input');
        $element.on('keydown', this.handleOnKeyDown);
        $element.focus();
    }

    handleClose(e) {
        e.stopPropagation();
        e.preventDefault();
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    handleSelect(value) {
        if (this.props.onChangeValue) {
            this.props.onChangeValue(value);
            this.selected = true;
        }
    }

    handleChange(value) {
        if(this.selected){
            this.setState({ value: ''});
            this.selected = false;
        } else {
            this.setState({ value: value });
        }
    }

    handleOnKeyDown(e) {
        if (e.keyCode == 27) {
            this.handleClose(e);
        } else if( (e.metaKey || e.ctrlKey) && this.props.onChangeMethod){
            switch (e.keyCode) {
                case 65: // A key
                    e.stopPropagation();
                    e.preventDefault();
                    this.props.onChangeMethod('addBefore');
                    break;
                case 73: // I key
                    e.stopPropagation();
                    e.preventDefault();
                    this.props.onChangeMethod('insertFirst');
                    break;
                case 84: // T key
                    e.stopPropagation();
                    e.preventDefault();
                    this.props.onChangeMethod('replace');
                    break;
                case 86: // V key
                    e.stopPropagation();
                    e.preventDefault();
                    this.props.onChangeMethod('addAfter');
                    break;
                case 87: // W key
                    e.stopPropagation();
                    e.preventDefault();
                    this.props.onChangeMethod('wrap');
                    break;
                default:
                    break;
            }

        }
    }

    render() {
        var components = [];

        _.forOwn(this.props.componentsTree, (group, groupName) => {
            if (_.isObject(group)) {
                _.forOwn(group, (componentTypeValue, componentId) => {
                    components.push(componentId);
                });
            }
        });

        let methodLabel = '';
        switch(this.props.method){
            case 'addBefore':
                methodLabel = 'Add before selected';
                break;
            case 'insertFirst':
                methodLabel = 'Insert as first into selected';
                break;
            case 'replace':
                methodLabel = 'Replace selected with';
                break;
            case 'wrap':
                methodLabel = 'Wrap selected with';
                break;
            case 'insertLast':
                methodLabel = 'Insert as last into selected';
                break;
            case 'addAfter':
                methodLabel = 'Add after selected';
                break;
            default:
                break;
        }

        return (
            <div {...this.props} >
                <div style={{display: 'table', width: '100%'}}>
                    <div style={{display: 'table-row'}}>
                        <div style={{display: 'table-cell', textAlign: 'left', verticalAlign: 'middle'}}>
                            <a className="btn btn-xs btn-default btn-warning"
                               onClick={this.handleClose}>
                                <span className="fa fa-times fa-fw"></span>
                                <span>{methodLabel}</span>
                            </a>
                        </div>
                        <div style={{display: 'table-cell', width: '90%', verticalAlign: 'middle'}}>
                            <Combobox
                                ref="selectElement"
                                data={components}
                                caseSensitive={false}
                                minLength={1}
                                value={this.state.value}
                                onChange={this.handleChange}
                                filter={'startsWith'}
                                onSelect={this.handleSelect}/>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

}


function mapStateToProps(state) {
    const { deskPage } = state;
    return {
        componentsTree: deskPage.componentsTree
    };
}

export default connect(
    mapStateToProps
)(SearchComponentName);

