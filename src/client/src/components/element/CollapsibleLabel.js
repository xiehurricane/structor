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
import { Collapse } from 'react-bootstrap';

class CollapsibleLabel extends Component {

    constructor(props) {
        super(props);
        this.state = { open: props.open };
        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.props.onToggle){
            this.props.onToggle();
        }
        this.setState({open: !this.state.open});
    }

    render(){
        var caretClassName = 'fa text-muted';
        if(this.state.open === true){
            caretClassName += ' fa-caret-down';
        } else {
            caretClassName += ' fa-caret-right';
        }
        return (
            <div style={{position: 'relative'}}>
                <div className={caretClassName}
                     style={{position: "absolute", padding: "2px", top: "0", left: "-1em", cursor: 'pointer', width: '1.5em', height: '1.5em'}}>
                </div>
                <p style={{cursor: 'pointer'}} className='text-muted' onClick={this.handleToggle}>
                    <span>
                        {this.props.title}
                    </span>
                </p>
                <Collapse in={this.state.open}>
                    <div ref='panel' style={{padding: '0', marginTop: '0'}}>
                        {this.props.children}
                    </div>
                </Collapse>
            </div>
        );
    }

}

export default CollapsibleLabel;

