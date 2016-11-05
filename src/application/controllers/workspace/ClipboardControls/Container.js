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
import { modeMap } from '../QuickAppendModal/actions.js';

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick(e){
        e.preventDefault();
        e.stopPropagation();
        const { clipboardIndicatorModel: {clipboardKeys}} = this.props;
        const { showQuickAppend} = this.props;
        const funcSignature = e.currentTarget.dataset.func;
        if(clipboardKeys.length <= 0){
            switch(funcSignature) {
                case 'pasteBefore':
                    showQuickAppend(modeMap.addBefore);
                    break;
                case 'pasteAfter':
                    showQuickAppend(modeMap.addAfter);
                    break;
                case 'pasteFirst':
                    showQuickAppend(modeMap.insertFirst);
                    break;
                case 'pasteLast':
                    showQuickAppend(modeMap.insertLast);
                    break;
                case 'pasteReplace':
                    showQuickAppend(modeMap.replace);
                    break;
                default:
                    break;
            }
        } else {
            const func = this.props[e.currentTarget.dataset.func];
            if(func){
                func();
            }
        }
    }

    render(){
        const { clipboardIndicatorModel: {clipboardMode, clipboardKeys}} = this.props;
        const { selectionBreadcrumbsModel: {selectedKeys}} = this.props;

        const wideButtonLabelStyle = {
            margin: '0 0.5em',
            fontSize: '11px'
        };

        // let disabledCommon =
        //     (clipboardMode === CLIPBOARD_CUT && selectedKeys.length !== 1)
        //     || clipboardKeys.length <= 0
        //     || (clipboardMode === CLIPBOARD_CUT && !graphApi.isCutPasteAvailable(selectedKeys[0]));
        //let disabledSingle =
        //    (clipboardMode === CLIPBOARD_CUT && selectedKeys.length !== 1)
        //    || clipboardKeys.length !== 1
        //    || (clipboardMode === CLIPBOARD_CUT && !graphApi.isCutPasteAvailable(selectedKeys[0]));

        let controlGroup = (
            <div className="btn-group" role="group">
                <button
                    className="btn btn-default btn-xs"
                    data-func="pasteBefore"
                    disabled={!selectedKeys || selectedKeys.length <= 0}
                    onClick={this.handleButtonClick}
                    title="Append components before selected component">
                    <span style={wideButtonLabelStyle} >
                        <i className="umy-icon-append-before" />
                    </span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    data-func="pasteFirst"
                    disabled={!selectedKeys || selectedKeys.length <= 0}
                    onClick={this.handleButtonClick}
                    title="Insert components into selected component as the first child">
                    <span style={wideButtonLabelStyle}>
                        <i className="umy-icon-insert-first" />
                    </span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    disabled={!selectedKeys || selectedKeys.length <= 0}
                    data-func="pasteReplace"
                    onClick={this.handleButtonClick}
                    title="Replace selected component">
                    <span style={wideButtonLabelStyle}>
                        <i className="umy-icon-replace" />
                    </span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    data-func="pasteLast"
                    disabled={!selectedKeys || selectedKeys.length <= 0}
                    onClick={this.handleButtonClick}
                    title="Insert components into selected component as the last child">
                    <span style={wideButtonLabelStyle}>
                        <i className="umy-icon-insert-last" />
                    </span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    data-func="pasteAfter"
                    disabled={!selectedKeys || selectedKeys.length <= 0}
                    onClick={this.handleButtonClick}
                    title="Append components after selected component">
                    <span style={wideButtonLabelStyle}>
                        <i className="umy-icon-append-after" />
                    </span>
                </button>
                {/*<button
                    className="btn btn-default btn-xs"
                    disabled={disabledSingle}
                    data-func="pasteWrap"
                    onClick={this.handleButtonClick}
                    title="Wrap selected component with single component from clipboard">
                    <span style={wideButtonLabelStyle}>Wrap</span>
                </button>*/}
            </div>
        );
        return (
            <div style={this.props.style}>
                {controlGroup}
            </div>
        );
    }
}


export default connect(modelSelector, containerActions)(Container);

