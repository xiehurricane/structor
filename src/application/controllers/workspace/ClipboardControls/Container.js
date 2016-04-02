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
import { CLIPBOARD_COPY, CLIPBOARD_CUT, CLIPBOARD_EMPTY, CLIPBOARD_NEW } from '../ClipboardIndicator/actions.js';
import { graphApi } from '../../../api/index.js';

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick(e){
        e.preventDefault();
        e.stopPropagation();
        const func = this.props[e.currentTarget.dataset.func];
        if(func){
            const { selectionBreadcrumbsModel: {selectedKeys}} = this.props;
            func(selectedKeys[0]);
        }
    }

    render(){
        const { clipboardIndicatorModel: {clipboardMode, clipboardKeys}} = this.props;
        const { selectionBreadcrumbsModel: {selectedKeys}} = this.props;

        const wideButtonLabelStyle = {
            margin: '0 0.5em'
        };

        let disabledCommon = selectedKeys.length !== 1
            || clipboardKeys.length <= 0
            || (clipboardMode === CLIPBOARD_CUT && !graphApi.isCutPasteAvailable(selectedKeys[0]));
        let disabledSingle = selectedKeys.length !== 1
            || clipboardKeys.length !== 1
            || (clipboardMode === CLIPBOARD_CUT && !graphApi.isCutPasteAvailable(selectedKeys[0]));

        let controlGroup = (
            <div className="btn-group" role="group">
                <button
                    className="btn btn-default btn-xs"
                    disabled={disabledCommon}
                    data-func="pasteBefore"
                    onClick={this.handleButtonClick}
                    title="Append components from clipboard before selected component">
                    <span style={wideButtonLabelStyle}>Before</span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    disabled={disabledCommon}
                    data-func="pasteFirst"
                    onClick={this.handleButtonClick}
                    title="Insert components from clipboard into selected component on the first position">
                    <span style={wideButtonLabelStyle}>First</span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    disabled={disabledCommon}
                    data-func="pasteLast"
                    onClick={this.handleButtonClick}
                    title="Insert components from clipboard into selected component on the last position">
                    <span style={wideButtonLabelStyle}>Last</span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    disabled={disabledCommon}
                    data-func="pasteAfter"
                    onClick={this.handleButtonClick}
                    title="Append components from clipboard after selected component">
                    <span style={wideButtonLabelStyle}>After</span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    disabled={disabledCommon}
                    data-func="pasteReplace"
                    onClick={this.handleButtonClick}
                    title="Replace selected component with components from clipboard">
                    <span style={wideButtonLabelStyle}>Replace</span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    disabled={disabledSingle}
                    data-func="pasteWrap"
                    onClick={this.handleButtonClick}
                    title="Wrap selected component with single component from clipboard">
                    <span style={wideButtonLabelStyle}>Wrap</span>
                </button>
            </div>
        );
        return (
            <div {...this.props}>
                {controlGroup}
            </div>
        );
    }
}


export default connect(modelSelector, containerActions)(Container);

