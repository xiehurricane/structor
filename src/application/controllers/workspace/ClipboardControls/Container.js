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
import { containerActions, CLIPBOARD_COPY, CLIPBOARD_CUT, CLIPBOARD_EMPTY, CLIPBOARD_NEW } from './actions.js';
import { graphApi } from '../../../api/index.js';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const { componentModel: {clipboardMode, clipboardKeys}} = this.props;
        const { deskPageModel: {selectedKeys}} = this.props;
        const { removeClipboardKeys, pasteBefore, pasteAfter, pasteFirst, pasteLast } = this.props;

        const containerStyle = {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center'
            //padding: '0px 0px 0px 10px'
        };
        const controlsGroupStyle = {
            padding: '0px',
            margin: '0px 0.5em 0px 0px'
        };
        let typeLabelStyle = {
            padding: '3px 6px',
            borderRadius: '3px',
            cursor: 'pointer',
            backgroundColor: 'rgb(227, 227, 227)',
            color: 'rgb(107, 107, 107)',
            marginRight: '0.3em',
            textShadow: '0 1px 0px rgba(255, 255, 255, 0.8)'
        };
        let activeStyle = {
            padding: '3px 6px',
            borderRadius: '3px'};
        let clipboardTypeLabel;
        if(clipboardMode === CLIPBOARD_COPY){
            activeStyle.backgroundColor = '#f2fae3';
            activeStyle.color = '#659f13';
            clipboardTypeLabel = 'Copied in clipboard';
        } else if(clipboardMode === CLIPBOARD_CUT){
            activeStyle.backgroundColor = '#fffceb';
            activeStyle.color = '#e28327';
            clipboardTypeLabel = 'Cut in clipboard';
        } else if(clipboardMode === CLIPBOARD_NEW){
            activeStyle.backgroundColor = '#ebf7fd';
            activeStyle.color = '#2d7091';
            clipboardTypeLabel = 'New in clipboard';
        } else {
            clipboardTypeLabel = 'Empty clipboard';
        }
        const wideButtonLabelStyle = {
            margin: '0 0.5em'
        };
        let clipboardContent = null;
        if(clipboardKeys && clipboardKeys.length > 0){

            if(clipboardKeys.length === 1){
                let clipboardNode = graphApi.getNode(clipboardKeys[0]);
                clipboardContent = (
                    <span style={activeStyle}>
                        <span>{clipboardNode.modelNode.type}</span>
                    </span>
                );
            } else if(clipboardKeys.length > 0) {
                const childrenMenuItems = [];
                let clipboardNode;
                clipboardKeys.forEach((key, index) => {
                    clipboardNode = graphApi.getNode(key);
                    childrenMenuItems.push(
                        <li key={'menuItem' + index}>
                            <a href="#"
                               onClick={(e) => {e.stopPropagation(); e.preventDefault();}}
                               style={{display: 'flex', alignItems: 'center'}}>
                                {clipboardNode.modelNode.type}
                            </a>
                        </li>
                    );
                });
                clipboardContent = (
                    <span key={'menuMore'}
                          className="dropdown"
                          style={activeStyle}>
                        <span className="dropdown-toggle" data-toggle="dropdown">
                            <span>Multiple...&nbsp;</span><span className="caret"></span>
                        </span>
                        <ul className="dropdown-menu"
                            role="menu"
                            style={{overflowY: 'auto', maxHeight: '12em'}}>
                            {childrenMenuItems}
                        </ul>
                    </span>
                );
            }
        }
        let controlGroup = (
            <div style={controlsGroupStyle} className="btn-group" role="group">
                <button
                    className="btn btn-default btn-xs"
                    disabled={selectedKeys.length !== 1 || clipboardKeys.length <= 0}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); pasteBefore(selectedKeys[0]); }}
                    title="Append components in clipboard before selected component">
                    <span style={wideButtonLabelStyle}>Before</span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    disabled={selectedKeys.length !== 1 || clipboardKeys.length <= 0}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); pasteFirst(selectedKeys[0]); }}
                    title="Insert components in clipboard into selected component on the first position">
                    <span style={wideButtonLabelStyle}>First</span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    disabled={selectedKeys.length !== 1 || clipboardKeys.length <= 0}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); pasteLast(selectedKeys[0]); }}
                    title="Insert components in clipboard into selected component on the last position">
                    <span style={wideButtonLabelStyle}>Last</span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    disabled={selectedKeys.length !== 1 || clipboardKeys.length <= 0}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); pasteAfter(selectedKeys[0]); }}
                    title="Append components in clipboard after selected component">
                    <span style={wideButtonLabelStyle}>After</span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    disabled={selectedKeys.length !== 1 || clipboardKeys.length <= 0}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('copy to clipboard'); }}
                    title="Replace selected component with components in clipboard">
                    <span style={wideButtonLabelStyle}>Replace</span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    disabled={clipboardKeys.length !== 1 || selectedKeys.length !== 1}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('copy to clipboard'); }}
                    title="Wrap selected component with component in clipboard">
                    <span style={wideButtonLabelStyle}>Wrap</span>
                </button>
            </div>
        );
        return (
            <div {...this.props}>
                <div style={containerStyle}>
                    {controlGroup}
                    <span style={typeLabelStyle}
                          onClick={() => {removeClipboardKeys();}}
                          title="Click to remove items from clipboard.">
                        {clipboardMode !== CLIPBOARD_EMPTY ? <i className="fa fa-times-circle fa-fw"
                           style={{opacity: '0.6'}}></i> : null }
                        <span>{clipboardTypeLabel}</span>
                    </span>
                    {clipboardContent}
                </div>
            </div>
        );
    }
}


export default connect(modelSelector, containerActions)(Container);

