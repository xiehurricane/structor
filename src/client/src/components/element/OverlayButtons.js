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
import { Grid, Row, Col, Panel, Button, Nav, CollapsibleNav,
    Navbar, DropdownButton, MenuItem, NavItem } from 'react-bootstrap';

class OverlayButtons extends Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.props.onClose){
            this.props.onClose(e);
        }
    }

    render(){
        const { model } = this.props;
        let buttons = [];
        for (let i = 0; i < model.buttons.length; i++) {
            let buttonClassName = 'btn btn-info';
            if (model.buttons[i].btnClass) {
                buttonClassName += model.buttons[i].btnClass;
            }
            let inners = [];
            if (model.buttons[i].icon) {
                inners.push(<span key={'buttonIcon' + i} className={'fa fa-fw ' + model.buttons[i].icon}></span>);
            }
            if (model.buttons[i].label) {
                inners.push(<span key={'buttonLabel' + i}>{model.buttons[i].label}</span>);
            }
            let className = 'btn ' + (model.buttons[i].btnClass ? ' ' + model.buttons[i].btnClass : '');
            if(model.buttons[i].menu && model.buttons[i].menu.length > 0){
                var menuItems = [];
                model.buttons[i].menu.forEach( (menuItem, index) => {
                    let func = (function(callback){
                        return function(e){
                            if(callback){
                                callback(e);
                            }
                        }
                    }(menuItem.onClick));
                    if(menuItem.label === '_divider'){
                        menuItems.push(
                            <li key={'menuItem' + index} role="separator" className="divider"></li>
                        );
                        func = undefined;
                    } else {
                        menuItems.push(
                            <li key={'menuItem' + index}><a style={{cursor: 'pointer'}} onClick={func}>{menuItem.label}</a></li>
                        );
                    }
                });
                buttons.push(
                    <div key={'button' + i} className="btn-group btn-group-xs" role="group">
                        <button type="button"
                                className={className + " dropdown-toggle"}
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false">
                            {inners}
                            <span className="fa fa-fw fa-caret-down"></span>
                        </button>
                        <ul className="dropdown-menu">
                            {menuItems}
                        </ul>
                    </div>
                );
            } else {
                const onClick = (function (callback) {
                    return function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (callback) {
                            callback(e);
                        }
                    }
                }(model.buttons[i].onClick));
                if(model.buttons[i].tooltip){
                    buttons.push(
                        <button key={'button' + i}
                                type='button'
                                style={{display: 'table-cell'}}
                                className={className}
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title={model.buttons[i].tooltip}
                                onClick={onClick}>
                            {inners}
                        </button>
                    );
                } else {
                    buttons.push(
                        <button key={'button' + i}
                                type='button'
                                style={{display: 'table-cell'}}
                                className={className}
                                onClick={onClick}>
                            {inners}
                        </button>
                    );
                }
            }
        }

        return (
            <div style={{display: 'table', width: '100%'}}>
                <div style={{display: 'table-row', width: '100%', whiteSpace: 'nowrap'}}>
                    <div style={{display: 'table-cell', textAlign: 'center', width: '100%'}}>
                        <div className='btn-group btn-group-xs' role='group'>
                            <button type='button' className='btn btn-warning' onClick={this.handleClose}>
                                <span className='fa fa-times fa-fw'></span>
                            </button>
                            {buttons}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default OverlayButtons;
