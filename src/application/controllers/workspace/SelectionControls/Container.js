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

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){

        return (
            <div {...this.props} className="btn-group" role="group">
                <button
                    className="btn btn-default btn-xs"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('copy to clipboard'); }}
                    title="Copy selected components to clipboard">
                    <span className="fa fa-clipboard"></span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('cut to clipboard'); }}
                    title="Cut selected components to clipboard">
                    <span className="fa fa-scissors"></span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('clone selected'); }}
                    title="Clone selected components">
                    <span className="fa fa-clone"></span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('move up'); }}
                    title="Move up selected components within their parents">
                    <span className="fa fa-arrow-up"></span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('move down'); }}
                    title="Move down selected components within their parents">
                    <span className="fa fa-arrow-down"></span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('delete'); }}
                    title="Delete selected components">
                    <span className="fa fa-trash-o"></span>
                </button>
            </div>
        );
    }
}


export default connect(modelSelector)(Container);

