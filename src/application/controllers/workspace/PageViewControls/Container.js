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

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {componentModel, deskModel, changeViewportWidth, addNewPage, clonePage, currentPagePath} = this.props;

        return (
            <div {...this.props} className="btn-group" role="group">
                <button
                    key="addPageButton"
                    className="btn btn-default btn-xs"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addNewPage(); }}
                    title="Create new page">
                    <span className="fa fa-plus"></span>
                </button>
                <button
                    key="copyPageButton"
                    className="btn btn-default btn-xs"
                    onClick={(e) => {e.preventDefault(); e.stopPropagation(); clonePage(currentPagePath);}}
                    title="Duplicate current page">
                    <span className="fa fa-copy"></span>
                </button>
                <div key="pageWidthButton" className="btn-group" role="group">
                    <button className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                        {deskModel.iframeWidth}&nbsp;&nbsp;
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
