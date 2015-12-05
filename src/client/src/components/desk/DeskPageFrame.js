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
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, Button, Nav, CollapsibleNav,
    Navbar, DropdownButton, MenuItem, NavItem } from 'react-bootstrap';

import * as ServerActions from '../../actions/serverActions.js';
import * as DeskPageActions from '../../actions/deskPageActions.js';
import * as UtilStore from '../../api/utilStore.js';

class DeskPageFrame extends Component {

    constructor(props) {
        super(props);
        this.waitingCounter = 0;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        //this.reloadPage = this.reloadPage.bind(this);
        //this.handleRecheckClick = this.handleRecheckClick.bind(this);
        //this.handleLogout = this.handleLogout.bind(this);
        //this.handleLogin = this.handleLogin.bind(this);
    }

    componentDidMount(){
        var domNode = ReactDOM.findDOMNode(this);
        domNode.onload = ( () => {

            //const { contentDocument, contentWindow } = domNode;
            this.contentDocument = domNode.contentDocument;
            this.contentWindow = domNode.contentWindow;

            if(this.contentDocument.readyState === 'complete' && !this.contentWindow.pageReadyState){

                if(this.waitingCounter < 3){
                    setTimeout(() => { this.reloadPage('/'); this.waitingCounter++; }, 1000);
                } else {
                    this.waitingCounter = 0;
                    this.props.receiveServerResponseSuccess('loadingPageFrame', true);
                }

            } else {
                if(this.contentWindow.pageReadyState !== 'initialized'){

                    this.waitingCounter = 0;

                    //console.log('page was not initiated in iframe, do it first time');
                    this.contentWindow.__setCurrentPathname = (function(_func){
                        return function(pagePath){
                            _func(pagePath);
                        }
                    }(this.props.switchPageToPath));

                    this.contentWindow.__closePreview = (function(_func){
                        return function(){
                            _func();
                        }
                    }(this.props.hideAvailableComponentPreview));

                    this.contentWindow.__deletePreview = (function(_func){
                        return function(){
                            _func();
                        }
                    }(this.props.deleteAvailableComponentPreviewIndex));

                    // available callbacks from PageForDesk
                    this.contentWindow.onPageDidMount = () => {
                        //console.log('Page was mounted: ' + this.props.currentPagePath);
                    };
                    this.contentWindow.onPageWillUnmount = () => {
                        //console.log('Page will unmount: ' + this.props.currentPagePath);
                        if(this.props.isEditMode){
                            this.clearDomNodes();
                        }
                    };
                    this.contentWindow.onPageDidUpdate = () => {
                        //console.log('Page did update: ' + this.props.currentPagePath);
                        if(this.props.isEditMode){
                            this.mapDomNodes();
                        }
                    };
                    this.contentWindow.onPageWillUpdate = () => {
                        //console.log('Page will update: ' + this.props.currentPagePath);
                        if(this.props.isEditMode){
                            this.clearDomNodes();
                        }
                    };

                    this.contentWindow.__createPageDesk(this.props.model);
                }
                this.props.receiveServerResponseSuccess('loadingPageFrame', true);
            }
        });
    }

    componentWillUpdate(nextProps, nextState){
        //console.log('DeskPageFrame will update');

        if(this.props.reloadPageCounter < nextProps.reloadPageCounter){

            if(this.props.currentPagePath !== nextProps.currentPagePath){
                this.reloadPage(nextProps.currentPagePath);
            } else {
                this.reloadPage(this.props.currentPagePath);
            }

        } else if(this.props.currentPagePath !== nextProps.currentPagePath
            && this.contentDocument
            && this.contentWindow){

            if(this.contentDocument.readyState === 'complete'
                && this.contentWindow.pageReadyState
                && this.props.reloadPageModelCounter < nextProps.reloadPageModelCounter){

                this.contentWindow.__switchToPath(nextProps.currentPagePath);
            }

        } else {

            this.hasToUpdateModel = (this.props.modelChangeCounter < nextProps.modelChangeCounter);
            this.hasToUpdatePreviewModel = (this.props.previewComponentCounter < nextProps.previewComponentCounter);

        }

        this.isEditModeSwitched = (this.props.isEditMode !== nextProps.isEditMode);
    }

    shouldComponentUpdate(nextProps, nextState){
        return (
            this.props.currentPagePath !== nextProps.currentPagePath
            || this.props.reloadPageCounter < nextProps.reloadPageCounter
            || this.props.modelChangeCounter < nextProps.modelChangeCounter
            || this.props.previewComponentCounter < nextProps.previewComponentCounter
            || this.props.isEditMode !== nextProps.isEditMode
            || this.props.reloadPageModelCounter !== nextProps.reloadPageModelCounter
            || this.props.style.width !== nextProps.style.width
        );
    }

    componentDidUpdate(){
        //console.log('DeskPageFrame did update');
        if(this.contentWindow && this.contentWindow.Page){
            if(this.hasToUpdatePreviewModel){
                //console.log('Has to update preview model');
                this.contentWindow.Page.updatePreviewModel(this.props.previewModel);
                this.hasToUpdatePreviewModel = false;
                this.clearDomNodes();
            } else if(this.hasToUpdateModel){
                //console.log('Has to update page model');
                this.contentWindow.Page.updateModel(this.props.model);
                this.hasToUpdateModel = false;
                if(this.props.isEditMode){
                    this.mapDomNodes();
                } else {
                    this.clearDomNodes();
                }
            } else if(this.isEditModeSwitched){
                if(this.props.isEditMode){
                    this.mapDomNodes();
                } else {
                    this.clearDomNodes();
                }
                this.isEditModeSwitched = false;
            }
        }
    }

    reloadPage(pagePath){
        this.props.waitServerResponse('loadingPageFrame');
        var domNode = ReactDOM.findDOMNode(this);
        domNode.src = '/deskpage' + pagePath;
    }

    clearDomNodes(){
        const nodeMap = UtilStore.getPageDomNodeMap();
        _.forOwn(nodeMap, (node, key) => {
            if(node){
                $(node).off("mousedown.umy");
            }
        });
        if(this.contentWindow) {
            this.contentWindow.removeEventListener('keydown', this.handleKeyDown, false);
        }
        window.removeEventListener('keydown', this.handleKeyDown, false);
        UtilStore.resetPageDomNode();
        UtilStore.resetFrameWindow();

    }

    mapDomNodes(){
        if(this.contentWindow && this.contentWindow.Page){
            this.clearDomNodes();
            UtilStore.setFrameWindow(this.contentWindow);
            const instanceMap = this.contentWindow.Page.getInstanceMap();
            _.forOwn(instanceMap, (DOMNode, key) => {
                UtilStore.setPageDomNode(key, DOMNode);
                $(DOMNode).on("mousedown.umy", ((_dataumyid, cb) => {
                    return (e) => {
                        if(!e.metaKey && !e.ctrlKey){
                            e.stopPropagation();
                            e.preventDefault();
                            cb(_dataumyid);
                        }
                    };
                })(key, this.props.setComponentSelection));
            });

            this.props.setComponentSelection();
            this.contentWindow.addEventListener('keydown', this.handleKeyDown, false);
            window.addEventListener('keydown', this.handleKeyDown, false);

        }
    }

    handleKeyDown(e){
        //console.log('Key is down');
        //console.log(document.activeElement);
        if(document.activeElement.tagName.toUpperCase() === 'BODY'
            || document.activeElement.tagName.toUpperCase() === 'A'
            || (document.activeElement.tagName.toUpperCase() === 'IFRAME'
            && document.activeElement.contentDocument === this.contentDocument)){
            if (e.which === 8 || e.which === 46) { // Del or Backspace key
                e.stopPropagation();
                e.preventDefault();
                this.props.deleteInModelSelected();
            } else if(e.which === 27){ // Esc key
                e.stopPropagation();
                e.preventDefault();
                this.props.discardClipboard();
                this.props.stopQuickPasteInModelByName();
            } else if (e.metaKey || e.ctrlKey) {
                //console.log('Meta key is down ->');
                const { selectedUmyIdToCopy, selectedUmyIdToCut } = this.props;
                switch (e.which) {
                    case 68: // D key
                        e.stopPropagation();
                        e.preventDefault();
                        this.props.duplicateInModelSelected();
                        break;
                    case 67: // C key
                        e.stopPropagation();
                        e.preventDefault();
                        this.props.copySelectedInClipboard();
                        break;
                    case 65: // A key
                        e.stopPropagation();
                        e.preventDefault();
                        if( selectedUmyIdToCopy ){
                            this.props.pasteInModelFromClipboard('addBefore');
                        } else if( selectedUmyIdToCut ){
                            this.props.pasteDeleteInModelFromClipboard('addBefore');
                        } else {
                            this.props.startQuickPasteInModelByName('addBefore');
                        }
                        break;
                    case 73: // I key
                        e.stopPropagation();
                        e.preventDefault();
                        if( selectedUmyIdToCopy ){
                            this.props.pasteInModelFromClipboard('insertFirst');
                        } else if( selectedUmyIdToCut ) {
                            this.props.pasteDeleteInModelFromClipboard('insertFirst');
                        } else {
                            this.props.startQuickPasteInModelByName('insertFirst');
                        }
                        break;
                    case 84: // T key
                        e.stopPropagation();
                        e.preventDefault();
                        if( selectedUmyIdToCopy ){
                            this.props.pasteInModelFromClipboard('replace');
                        } else if( selectedUmyIdToCut ) {
                            this.props.pasteDeleteInModelFromClipboard('replace');
                        } else {
                            this.props.startQuickPasteInModelByName('replace');
                        }
                        break;
                    case 86: // V key
                        e.stopPropagation();
                        e.preventDefault();
                        if( selectedUmyIdToCopy ) {
                            this.props.pasteInModelFromClipboard('addAfter');
                        } else if( selectedUmyIdToCut ) {
                            this.props.pasteDeleteInModelFromClipboard('addAfter');
                        } else {
                            this.props.startQuickPasteInModelByName('addAfter');
                        }
                        break;
                    case 87: // W key
                        e.stopPropagation();
                        e.preventDefault();
                        if( selectedUmyIdToCopy ) {
                            this.props.pasteInModelFromClipboard('wrap');
                        } else if( selectedUmyIdToCut ) {
                            this.props.pasteDeleteInModelFromClipboard('wrap');
                        } else {
                            this.props.startQuickPasteInModelByName('wrap');
                        }
                        break;
                    case 88: // X key
                        e.stopPropagation();
                        e.preventDefault();
                        this.props.cutSelectedInClipboard();
                        break;
                    case 90: // Z key
                        e.stopPropagation();
                        e.preventDefault();
                        this.props.undoModel();
                        break;
                    default:
                        break;
                }
            }
        }
    }


    render(){
        return (<iframe {...this.props} src="/deskpage/" />);
    }

}

function mapStateToProps(state) {
    const { desk, deskPage } = state;
    return {
        model: deskPage.model,
        modelChangeCounter: deskPage.modelChangeCounter,
        currentPagePath: deskPage.currentPagePath,
        reloadPageCounter: deskPage.reloadPageCounter,
        isEditMode: desk.isEditMode,
        editModeCounter: desk.editModeCounter,
        previewModel: deskPage.previewModel,
        previewComponentCounter: deskPage.previewComponentCounter,
        reloadPageModelCounter: deskPage.reloadPageModelCounter,
        selectedUmyIdToCopy: deskPage.selectedUmyIdToCopy,
        selectedUmyIdToCut: deskPage.selectedUmyIdToCut
    };
}

export default connect(
    mapStateToProps,
    {
        waitServerResponse: ServerActions.waitServerResponse,
        receiveServerResponseSuccess: ServerActions.receiveServerResponseSuccess,
        switchPageToPath: DeskPageActions.switchPageToPath,
        setComponentSelection: DeskPageActions.setComponentSelection,
        discardComponentSelection: DeskPageActions.discardComponentSelection,
        hideAvailableComponentPreview: DeskPageActions.hideAvailableComponentPreview,
        deleteAvailableComponentPreviewIndex: DeskPageActions.deleteAvailableComponentPreviewIndex,

        cutSelectedInClipboard: DeskPageActions.cutSelectedInClipboard,
        copySelectedInClipboard: DeskPageActions.copySelectedInClipboard,
        pasteInModelFromClipboard: DeskPageActions.pasteInModelFromClipboard,
        pasteDeleteInModelFromClipboard: DeskPageActions.pasteDeleteInModelFromClipboard,
        undoModel: DeskPageActions.undoModel,
        duplicateInModelSelected: DeskPageActions.duplicateInModelSelected,
        discardClipboard: DeskPageActions.discardClipboard,
        deleteInModelSelected: DeskPageActions.deleteInModelSelected,

        startQuickPasteInModelByName: DeskPageActions.startQuickPasteInModelByName,
        stopQuickPasteInModelByName: DeskPageActions.stopQuickPasteInModelByName

    }
)(DeskPageFrame);

