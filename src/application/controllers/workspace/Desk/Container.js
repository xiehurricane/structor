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

import {Button} from 'react-bootstrap';

import DeskPage from '../DeskPage';
import ToolbarLeft from '../ToolbarLeft';
import ToolbarTop from '../ToolbarTop';
import PageTreeViewPanel from '../PageTreeViewPanel';
import ToolbarSelection from '../ToolbarSelection';
import LibraryPanel from '../LibraryPanel';
import ComponentOptionsPanel from '../ComponentOptionsPanel';
import PageTreeViewToolbar from '../PageTreeViewToolbar';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {componentModel, deskPageModel, togglePageTreeview} = this.props;
        let leftPanelWidth = 0;
        let leftPanelInner = null;
        if(componentModel.isLibraryPanelActive && !deskPageModel.isLivePreviewModeOn){
            leftPanelWidth = 200;
            leftPanelInner = (<LibraryPanel />);
        }

        let bottomPanelHeight = 0;
        let bottomPanelInner = null;
        if(componentModel.isPageTreeviewActive && !deskPageModel.isLivePreviewModeOn){
            bottomPanelHeight = 300;
            bottomPanelInner = (<PageTreeViewPanel />);
        }

        let rightPanelWidth = 0;
        let rightPanelInner = null;
        if(componentModel.isQuickOptionsActive && !deskPageModel.isLivePreviewModeOn){
            rightPanelWidth = 250;
            rightPanelInner = (<ComponentOptionsPanel />);
        }

        let leftPanelStyle = {
            position: 'absolute',
            top: '0px',
            left: '4em',
            bottom: '0px',
            width: leftPanelWidth + "px",
            paddingRight: '5px',
            overflow: 'auto'
        };

        let bottomPanelStyle = {
            position: 'absolute',
            left: '0px',
            // left: 'calc(4em + ' + leftPanelWidth +'px)',
            right: '0px',
            bottom: '0px',
            height: bottomPanelHeight + "px",
            padding: '0 0 5px 0',
        };

        let topComponent = null;
        let topPanelHeight = 0;
        let breadcrumbsComponent = null;

        if(!deskPageModel.isLivePreviewModeOn){
            let toolbarTopStyle = {
                position: 'absolute',
                top: '0px',
                left: 'calc(4em + ' + leftPanelWidth + 'px)',
                right: '5px',
                height: '3em'
            };
            topComponent = <ToolbarTop style={toolbarTopStyle}/>;
            topPanelHeight = 3;

            let breadcrumbsTopStyle = {
                position: 'absolute',
                top: '3em',
                left: 'calc(4em + ' + leftPanelWidth + 'px)',
                right: '5px',
                height: '3em'
            };
            breadcrumbsComponent = (<ToolbarSelection style={breadcrumbsTopStyle}></ToolbarSelection>);
            topPanelHeight += 3;

        } else {
            topPanelHeight = 0.3;
        }

        let rightPanelStyle = {
            position: 'absolute',
            top: topPanelHeight + 'em',
            right: '0px',
            bottom: '0px',
            width: rightPanelWidth + "px",
            // paddingLeft: '5px',
            overflow: 'hidden',
            padding: '0 5px 5px 0',
        };

        let bodyContainerStyle = {
            position: 'absolute',
            top: topPanelHeight + 'em',
            left: 'calc(4em + ' + leftPanelWidth + 'px)',
            //bottom: 'calc(5px + ' + bottomPanelHeight + 'px)',
            // bottom: bottomPanelHeight + 'px',
            bottom: '0px',
            overflow: 'hidden',
            // right: '5px'
            right: 'calc(5px + ' + rightPanelWidth + 'px)',
        };

        let bodyStyle = {
            position: 'absolute',
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: 'calc(' + bottomPanelHeight + 'px + 5px)',
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            border : '1px solid #000000',
        };

        let iframeWidth = componentModel.iframeWidth;
        //let marginRight = '0';
        if(iframeWidth !== '100%'){
            iframeWidth = parseInt(iframeWidth) + 'px';
            //marginRight = 'calc((100% - ' + iframeWidth + ')/2)';
        }
        let iframeStyle = {
            // "height" : "calc(100% - 5px)",
            height : '100%',
            width : iframeWidth,
            minWidth : '320px',
            margin : '0px',
            //"marginRight": marginRight,
            padding : '0px',
            border : '0'
        };

        //let pageFrame = (<div style={iframeStyle} ></div>);
        let pageFrame = (<DeskPage frameBorder="0" style={iframeStyle} />);

        const leftBar = (<ToolbarLeft />);

        return (
            <div style={{width: '100%', height: '100%'}}>
                {leftBar}
                {leftPanelWidth > 0 ?
                    <div style={leftPanelStyle}>
                        {leftPanelInner}
                    </div>
                    :
                    null
                }
                {topComponent}
                {breadcrumbsComponent}
                <div style={bodyContainerStyle}>
                    <div style={bodyStyle}>
                        {pageFrame}
                    </div>
                    {bottomPanelHeight > 0 ?
                        <div style={bottomPanelStyle}>
                            <Button bsSize='xsmall'
                                    style={{
                                        padding: '0.2em',
                                        position: 'absolute',
                                        top: '2px',
                                        left: '2px',
                                        width: '2em',
                                        height: '2em',
                                        zIndex: 1030
                                    }}
                                    onClick={(e) => {togglePageTreeview()}}>
                                <span className='fa fa-times fa-fw'/>
                            </Button>
                            <PageTreeViewToolbar
                                style={{
                                    position: 'absolute',
                                    top: '5em',
                                    left: '2px',
                                    zIndex: 1030
                                }}
                            />
                            {bottomPanelInner}
                        </div>
                        :
                        null
                    }
                </div>
                {rightPanelWidth > 0 ?
                    <div style={rightPanelStyle}>
                        {rightPanelInner}
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}

export default connect(modelSelector, containerActions)(Container);
