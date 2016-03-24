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
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import { componentModel } from './selectors.js';
import * as actions from './actions.js';


import DeskPage from '../DeskPage';
import { componentModel as deskPageModel } from '../DeskPage/selectors.js';

import ToolbarLeft from '../ToolbarLeft';
import ToolbarTop from '../ToolbarTop';

//import ToolbarTop from '../toolbar/ToolbarTop.js';
//import ToolbarBreadcrumbs from '../toolbar/ToolbarBreadcrumbs.js';
//import DeskPageFrame from './DeskPageFrame.js';
//import PanelComponentsHierarchy from '../panel/PanelComponentsHierarchy.js';
//import PanelAvailableComponents from '../panel/PanelAvailableComponents.js';
//import PanelOptions from '../panel/PanelOptions.js';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {componentModel, deskPageModel} = this.props;
        let leftPanelWidth = 0;
        let leftPanelInner = null;
        if(this.props.isAvailableComponentsButtonActive){
            leftPanelWidth = 200;
            leftPanelInner = (<div></div>);
            //leftPanelInner = (<PanelAvailableComponents />);
        }

        let bottomPanelHeight = 0;
        let bottomPanelInner = null;
        if(this.props.isComponentsHierarchyButtonActive){
            bottomPanelHeight = 300;
            bottomPanelInner = (<div></div>);
            //bottomPanelInner = (<PanelComponentsHierarchy />);
        }

        let rightPanelWidth = 0;
        let rightPanelInner = null;
        if(this.props.isQuickOptionsButtonActive){
            rightPanelWidth = 250;
            rightPanelInner = (<div></div>);
            //rightPanelInner = (<PanelOptions></PanelOptions>);
        }

        let leftPanelStyle = {
            position: 'absolute',
            top: 0,
            left: '4em',
            bottom: '0px',
            width: leftPanelWidth + "px",
            paddingRight: '5px',
            overflow: 'auto'
        };

        let bottomPanelStyle = {
            position: 'absolute',
            left: 'calc(4em + ' + leftPanelWidth +'px)',
            right: '5px',
            bottom: '0px',
            height: bottomPanelHeight + "px"
        };

        let rightPanelStyle = {
            position: 'absolute',
            top: 0,
            right: '0px',
            bottom: '5px',
            width: rightPanelWidth + "px",
            paddingLeft: '5px',
            overflow: 'auto'
        };

        let topComponent = null;
        let topPanelHeight = 0;
        let breadcrumbsComponent = null;

        if(!deskPageModel.isLivePreviewModeOn){
            let toolbarTopStyle = {
                position: 'absolute',
                top: 0,
                left: 'calc(4em + ' + leftPanelWidth + 'px)',
                right: '5px',
                height: '3em'
            };
            topComponent = <ToolbarTop style={toolbarTopStyle}/>;
            topPanelHeight = 3;

            if(!this.props.isComponentsHierarchyButtonActive){
                let breadcrumbsTopStyle = {
                    position: 'absolute',
                    top: '3em',
                    left: 'calc(4em + ' + leftPanelWidth + 'px)',
                    right: '5px',
                    height: '3em'
                };
                breadcrumbsComponent = (<div style={breadcrumbsTopStyle}></div>);
                //breadcrumbsComponent = (<ToolbarBreadcrumbs style={breadcrumbsTopStyle}></ToolbarBreadcrumbs>);
                topPanelHeight += 3;
            }

        } else {
            topPanelHeight = 0.3;
        }

        let bodyContainerStyle = {
            position: 'absolute',
            top: topPanelHeight + 'em',
            left: 'calc(4em + ' + leftPanelWidth + 'px)',
            //bottom: 'calc(5px + ' + bottomPanelHeight + 'px)',
            bottom: bottomPanelHeight + 'px',
            overflow: 'hidden',
            right: '5px'
        };

        let bodyStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            //bottom: 'calc(5px + ' + bottomPanelHeight + 'px)',
            overflowX: 'auto',
            overflowY: 'hidden',
            bottom: 0,
            WebkitOverflowScrolling: 'touch',
            right: rightPanelWidth + 'px'
        };

        let iframeWidth = componentModel.iframeWidth;
        //let marginRight = '0';
        if(iframeWidth !== '100%'){
            iframeWidth = parseInt(iframeWidth) + 'px';
            //marginRight = 'calc((100% - ' + iframeWidth + ')/2)';
        }
        let iframeStyle = {
            "height" : "calc(100% - 5px)",
            //"height" : "100%",
            "width" : iframeWidth,
            "minWidth" : "320px",
            "margin" : "0",
            //"marginRight": marginRight,
            "padding" : "0",
            "border" : "1px solid #000000"
        };

        //let pageFrame = (<div style={iframeStyle} ></div>);
        let pageFrame = (<DeskPage frameBorder="0" style={iframeStyle} />);

        const leftBar = (<ToolbarLeft />);

        return (
            <div>
                {leftBar}
                <div style={leftPanelStyle}>
                    {leftPanelInner}
                </div>
                {topComponent}
                {breadcrumbsComponent}
                <div style={bodyContainerStyle}>
                    <div style={bodyStyle}>
                        {pageFrame}
                    </div>
                    <div style={rightPanelStyle}>
                        {rightPanelInner}
                    </div>
                </div>
                <div style={bottomPanelStyle}>
                    {bottomPanelInner}
                </div>
            </div>
        )

    }

}

export default connect(
    createStructuredSelector({componentModel, deskPageModel}),
    dispatch => bindActionCreators(actions, dispatch)
)(Container)
