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
import { Button } from 'react-bootstrap';

import * as UtilStore from '../../api/utilStore.js';
import OverlayButtonsControl from '../element/OverlayButtonsControl.js';

import * as DeskActions from '../../actions/deskActions.js';
import * as DeskPageActions from '../../actions/deskPageActions.js';
import * as ModalPageInfoActions from '../../actions/modalPageInfoActions.js';

class ToolbarTop extends Component {

    constructor(props) {
        super(props);
        //this.state = { open: props.open };
        this.handleSwitchToPage = this.handleSwitchToPage.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handleReloadPage = this.handleReloadPage.bind(this);
        this.handleCopyPage = this.handleCopyPage.bind(this);
        this.handleAddNewPage = this.handleAddNewPage.bind(this);
        this.handleUndo = this.handleUndo.bind(this);
        this.handleDeletePage = this.handleDeletePage.bind(this);
        this.handlePageInfoEdit = this.handlePageInfoEdit.bind(this);
    }

    handleSwitchToPage(e){
        e.stopPropagation();
        e.preventDefault();
        //console.log('Proposed page index: ' + e.currentTarget.attributes['data-page-index'].value);
        this.props.switchPageToIndex(e.currentTarget.attributes['data-page-index'].value);
    }

    handleCancelClick(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.discardClipboard();
    }

    handleReloadPage(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.commandReloadPage();
    }

    handleCopyPage(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.copyCurrentPage();
    }

    handleAddNewPage(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.addNewPage();
    }

    handleUndo(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.undoModel();
    }

    handleDeletePage(e){
        e.stopPropagation();
        e.preventDefault();
        if(confirm('Please confirm current page deletion.')){
            this.props.deleteCurrentPage();
        }
    }

    handlePageInfoEdit(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.showModalPageInfo();
    }

    recreateTooltips(){
        //let thisDOMNode = React.findDOMNode(this);
        //$(thisDOMNode).find('[data-toggle="tooltip"]').tooltip('destroy');
        //$(thisDOMNode).find('[data-toggle="tooltip"]').tooltip({delay: { "show": 500, "hide": 100 }, container: 'body'});
    }

    shouldComponentUpdate(nextProps, nextState){
        return (
            this.props.currentPagePath !== nextProps.currentPagePath
            || this.props.modelChangeCounter < nextProps.modelChangeCounter
            || this.props.reloadPageCounter < nextProps.reloadPageCounter
            || this.props.iframeWidth !== nextProps.iframeWidth
            || this.props.inClipboard !== nextProps.inClipboard
            || this.props.isAvailableComponentsButtonActive !== nextProps.isAvailableComponentsButtonActive
            || this.props.isQuickOptionsButtonActive !== nextProps.isQuickOptionsButtonActive
        );
    }

    componentWillUpdate(nextProps, nextState){
    }

    componentDidMount(){
        this.recreateTooltips();
    }

    componentDidUpdate(){
        //console.log('ToolbarTop was updated....');
        this.recreateTooltips();
    }

    render(){

        let { model, currentPagePath } = this.props;

        let pagesList = [];
        if(model.pages && model.pages.length > 0){
            let indexRouteLabel = ' [IndexRoute]';
            model.pages.forEach( (page, index) => {
                let routePathLabel = page.pagePath;
                if(index === 0){
                    if(routePathLabel === currentPagePath){
                        currentPagePath += indexRouteLabel;
                    }
                    routePathLabel += indexRouteLabel;
                }
                pagesList.push(
                    <li key={'pageMenuItem' + index}>
                        <a onClick={this.handleSwitchToPage} data-page-index={index} href="#">
                            {routePathLabel}
                        </a>
                    </li>
                );
            } );
        }
        //console.log('inClipboard: ' + this.props.inClipboard + ' mode: ' + this.props.clipboardMode);
        let clipboardContent = [];
        if(this.props.clipboardMode !== 'EMPTY_MODE'){
            clipboardContent.push(
                <div key='clearClipboardButton' style={{display: 'table-cell', verticalAlign: 'middle', paddingLeft: '0.5em'}}>
                    <button
                        className="btn btn-xs btn-warning"
                        onClick={this.handleCancelClick}>
                        <span className="fa fa-times fa-fw"></span>
                        <span>In clipboard</span>
                    </button>
                </div>
            );
            clipboardContent.push(
                <div key='clipboardLabel' style={{
                                display: 'table-cell',
                                verticalAlign: 'middle',
                                paddingLeft: '0.5em'}}>
                    <kbd>{'<' + this.props.inClipboard + '>'}</kbd>
                </div>
            );
        } else {
            let pageActionsGroup = [];
            //pageActionsGroup.push(
            //        <button
            //            key="reloadPageButton"
            //            className="btn btn-default btn-xs"
            //            onClick={this.handleReloadPage}
            //            data-toggle="tooltip"
            //            data-placement="bottom"
            //            title="Reload current page">
            //            <span className="fa fa-refresh"></span>
            //        </button>
            //);
            pageActionsGroup.push(
                    <button
                        key="addPageButton"
                        className="btn btn-default btn-xs"
                        onClick={this.handleAddNewPage}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Create new page">
                        <span className="fa fa-plus"></span>
                    </button>
            );
            pageActionsGroup.push(
                <button
                    key="copyPageButton"
                    className="btn btn-default btn-xs"
                    onClick={this.handleCopyPage}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Duplicate current page">
                    <span className="fa fa-copy"></span>
                </button>
            );
            pageActionsGroup.push(
                    <div key="pageWidthButton" className="btn-group" role="group">
                        <button className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                            {this.props.iframeWidth}&nbsp;&nbsp;
                            <span className="caret"></span>
                            &nbsp;&nbsp;
                        </button>
                        <ul className="dropdown-menu" role="menu">
                            <li>
                                <a href="#" onClick={ () => this.props.changeFrameWidth('100%') }>
                                    100%
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={ () => this.props.changeFrameWidth('1800px') }>
                                    1800px
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={ () => this.props.changeFrameWidth('1200px') }>
                                    1200px
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={ () => this.props.changeFrameWidth('1100px') }>
                                    1100px
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={ () => this.props.changeFrameWidth('1000px') }>
                                    1000px
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={ () => this.props.changeFrameWidth('900px') }>
                                    900px
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={ () => this.props.changeFrameWidth('770px') }>
                                    770px
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={ () => this.props.changeFrameWidth('700px') }>
                                    700px
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={ () => this.props.changeFrameWidth('340px') }>
                                    340px
                                </a>
                            </li>

                        </ul>
                    </div>
            );
            clipboardContent.push(
                <div key='pageGroup' style={{display: 'table-cell', verticalAlign: 'middle', paddingLeft: '0.5em'}}>
                    <div
                        className="btn-group"
                        role="group">
                        {pageActionsGroup}
                    </div>
                </div>
            );

            clipboardContent.push(
                <div key='undoButton' style={{display: 'table-cell', verticalAlign: 'middle', paddingLeft: '0.5em'}}>
                    <button
                        className="btn btn-default btn-xs"
                        onClick={this.handleUndo}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Undo last action on the page">
                        <span className="fa fa-rotate-left" />
                    </button>
                </div>
            );

        }
        clipboardContent.push(
            <div key="overlayButtons" style={{display: 'table-cell', verticalAlign: 'middle', paddingLeft: '0.5em'}}>
                <OverlayButtonsControl
                    isFullFledged={true}
                    isGlobalOverlay={true} />
            </div>
        );


        return (
            <div style={this.props.style}>
                <div style={{width: '100%'}}>
                    <div style={{
                    display: 'table',
                    padding: '5px 10px 5px 10px'
                }}>
                        <div style={{display: 'table-row'}}>
                            <div style={{display: 'table-cell', verticalAlign: 'middle'}}>
                                <div className="btn-group" role="group">
                                    <button
                                        className="btn btn-default btn-xs"
                                        onClick={this.handleDeletePage}
                                        data-toggle="tooltip"
                                        data-placement="bottom"
                                        title="Delete current page">
                                        <span className="fa fa-trash-o" ></span>
                                    </button>
                                    <button
                                        className="btn btn-default btn-xs"
                                        onClick={this.handlePageInfoEdit}
                                        data-toggle="tooltip"
                                        data-placement="bottom"
                                        title="View page info">
                                        <span>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {currentPagePath}
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </span>
                                    </button>
                                    <div className="btn-group" role="group">
                                        <button className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                                            &nbsp;&nbsp;
                                            <span className="caret"></span>
                                            &nbsp;&nbsp;
                                        </button>
                                        <ul className="dropdown-menu" role="menu">
                                            <li role="presentation" className="dropdown-header">Switch to:</li>
                                            {pagesList}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {clipboardContent}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { desk, deskPage } = state;
    return {
        isAvailableComponentsButtonActive: desk.isAvailableComponentsButtonActive,
        isQuickOptionsButtonActive: desk.isQuickOptionsButtonActive,
        iframeWidth: desk.iframeWidth,
        model: deskPage.model,
        modelChangeCounter: deskPage.modelChangeCounter,
        currentPagePath: deskPage.currentPagePath,
        reloadPageCounter: deskPage.reloadPageCounter,
        inClipboard: deskPage.inClipboard,
        clipboardMode: deskPage.clipboardMode
    };
}

let mappedActions = Object.assign({}, DeskPageActions,
    {
        showModalPageInfo: ModalPageInfoActions.showModalPageInfo,
        changeFrameWidth: DeskActions.changeFrameWidth
    }
);


export default connect(
    mapStateToProps,
    mappedActions
)(ToolbarTop);
