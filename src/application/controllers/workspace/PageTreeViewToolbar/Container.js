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
        const { selectionBreadcrumbsModel: {selectedKeys} } = this.props;
        const { setForCuttingKeys, setForCopyingKeys, cloneSelected, moveSelected, deleteSelected } = this.props;
        return (
            <div {...this.props}>
                <div className="btn-group-vertical btn-group-xs">
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setForCopyingKeys(selectedKeys); }}
                        title="Copy selected components to clipboard">
                        <span className="fa fa-clipboard" />
                    </button>
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setForCuttingKeys(selectedKeys); }}
                        title="Cut selected components to clipboard">
                        <span className="fa fa-scissors" />
                    </button>
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); cloneSelected(); }}
                        title="Clone selected components">
                        <span className="fa fa-clone" />
                    </button>
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); moveSelected(true); }}
                        title="Move up selected components within their parents">
                        <span className="fa fa-arrow-up" />
                    </button>
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); moveSelected(false); }}
                        title="Move down selected components within their parents">
                        <span className="fa fa-arrow-down" />
                    </button>
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteSelected(); }}
                        title="Delete selected components">
                        <span className="fa fa-trash-o" />
                    </button>
                </div>
            </div>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);
