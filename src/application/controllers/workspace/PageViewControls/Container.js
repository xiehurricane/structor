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
import { ADD_NEW, DUPLICATE } from '../PageOptionsModal/actions.js';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {componentModel, deskModel, changeViewportWidth, showModal} = this.props;
        const buttonLabelStyle = {
            margin: '0 0.5em'
        };
        return (
            <div style={this.props.style} className="btn-group" role="group">
                <button
                    key="addPageButton"
                    className="btn btn-default btn-xs"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); showModal(ADD_NEW); }}
                    title="Create new page">
                    <span style={buttonLabelStyle} className="fa fa-plus"></span>
                </button>
                <button
                    key="copyPageButton"
                    className="btn btn-default btn-xs"
                    onClick={(e) => {e.preventDefault(); e.stopPropagation(); showModal(DUPLICATE); }}
                    title="Clone current page">
                    <span style={buttonLabelStyle} className="fa fa-copy"></span>
                </button>
                <div key="pageWidthButton" className="btn-group" role="group">
                    <button className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                        <span style={buttonLabelStyle}>{deskModel.iframeWidth}</span>
                        <span className="caret"></span>
                        &nbsp;&nbsp;
                    </button>
                    <ul className="dropdown-menu" role="menu">
                        <li>
                            <a href="#" onClick={ (e) => changeViewportWidth('100%') }>
                                100%
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={ (e) => changeViewportWidth('1800px') }>
                                1800px
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={ (e) => changeViewportWidth('1200px') }>
                                1200px
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={ (e) => changeViewportWidth('1100px') }>
                                1100px
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={ (e) => changeViewportWidth('1000px') }>
                                1000px
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={ (e) => changeViewportWidth('900px') }>
                                900px
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={ (e) => changeViewportWidth('770px') }>
                                770px
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={ (e) => changeViewportWidth('700px') }>
                                700px
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={ (e) => changeViewportWidth('340px') }>
                                340px
                            </a>
                        </li>

                    </ul>
                </div>
            </div>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);
