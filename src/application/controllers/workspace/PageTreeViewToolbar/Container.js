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

    handleButtonClick = (type) => (e) => {
        e.stopPropagation();
        e.preventDefault();
        const { setForCuttingKeys, setForCopyingKeys, cloneSelected, moveSelected, deleteSelected } = this.props;
        const { selectionBreadcrumbsModel: {selectedKeys} } = this.props;
        switch(type) {
            case 'copy':
                setForCopyingKeys(selectedKeys);
                break;
            case 'cut':
                setForCuttingKeys(selectedKeys);
                break;
            case 'duplicate':
                cloneSelected();
                break;
            case 'moveUp':
                moveSelected(true);
                break;
            case 'moveDown':
                moveSelected(false);
                break;
            case 'delete':
                deleteSelected();
                break;

            default:
                break;
        }
    };

    render(){
        const { selectionBreadcrumbsModel: {selectedKeys} } = this.props;
        return (
            <div style={this.props.style}>
                <div className="btn-group-vertical btn-group-xs">
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={this.handleButtonClick('copy')}
                        title="Copy selected components to clipboard">
                        <span className="fa fa-clipboard" />
                    </button>
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={this.handleButtonClick('cut')}
                        title="Cut selected components to clipboard">
                        <span className="fa fa-scissors" />
                    </button>
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={this.handleButtonClick('duplicate')}
                        title="Clone selected components">
                        <span className="fa fa-clone" />
                    </button>
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={this.handleButtonClick('moveUp')}
                        title="Move up selected components within their parents">
                        <span className="fa fa-arrow-up" />
                    </button>
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={this.handleButtonClick('moveDown')}
                        title="Move down selected components within their parents">
                        <span className="fa fa-arrow-down" />
                    </button>
                    <button
                        className="btn btn-warning"
                        disabled={selectedKeys.length <= 0}
                        onClick={this.handleButtonClick('delete')}
                        title="Delete selected components">
                        <span className="fa fa-trash-o" />
                    </button>
                </div>
            </div>
        );
    }
}

export default connect(modelSelector, containerActions)(Container);
