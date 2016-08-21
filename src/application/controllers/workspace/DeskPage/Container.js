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

import { forOwn } from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { utilsStore, graphApi, previewGraphApi } from '../../../api/index.js';
import { CLIPBOARD_CUT } from '../ClipboardControls/actions.js';

let lastWaitTimer = undefined;
const wait = (testFunc, launchFunc) => {
    if(lastWaitTimer){
        clearTimeout(lastWaitTimer);
        lastWaitTimer = undefined;
    }
    if(!testFunc()){
        lastWaitTimer = setTimeout(() => { wait(testFunc, launchFunc); }, 3000);
    } else {
        launchFunc();
    }
};

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleComponentClick = this.handleComponentClick.bind(this);
        this.handlePathnameChanged = this.handlePathnameChanged.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.setupShortcuts = this.setupShortcuts.bind(this);
        this.removeShortcuts = this.removeShortcuts.bind(this);
    }

    componentDidMount(){

        const domNode = ReactDOM.findDOMNode(this);
        const { componentModel:{pages, currentPagePath} } = this.props;
        if(currentPagePath){
            domNode.src = '/structor-deskpage' + currentPagePath;
        }

        const { loadPage, pageLoaded } = this.props;
        const { setForCuttingKeys, setForCopyingKeys } = this.props;
        const { pasteBefore, pasteAfter, pasteFirst, pasteLast, pasteReplace } = this.props;
        const { cloneSelected, deleteSelected } = this.props;
        const { setDefaultVariant, hidePreviewComponent, selectVariant } = this.props;
        const { quickBefore, quickAfter, quickFirst, quickLast, quickReplace } = this.props;
        const { loadOptions } = this.props;
        loadPage();
        this.contentDocument = domNode.contentDocument;
        this.contentWindow = domNode.contentWindow;
        this.setupShortcuts();

        domNode.onload = ( () => {
            this.contentWindow.__pages = pages;
            this.contentWindow.onPageDidMount = (page) => {
                this.page = page;

                page.bindOnComponentMouseDown(this.handleComponentClick);
                page.bindOnPathnameChanged(this.handlePathnameChanged);
                page.bindGetPagePath(pathname => graphApi.getPagePath(pathname));
                page.bindGetPageModel(pathname => graphApi.getWrappedModelByPagePath(pathname));
                page.bindGetMarked(pathname => graphApi.getMarkedKeysByPagePath(pathname));
                page.bindGetMode(() => {return this.props.componentModel.isEditModeOn;});

                page.bindGetComponentInPreview(() => {
                    const { libraryPanelModel: {componentInPreview, variantsInPreview, defaultVariantMap}} = this.props;
                    if(componentInPreview){
                        const defaultVariantKey = defaultVariantMap[componentInPreview].key;
                        const previewModel = previewGraphApi.getWrappedModelForVariant(defaultVariantKey);
                        return {componentInPreview, variantsInPreview, previewModel, defaultVariantKey};
                    } else {
                        return undefined;
                    }
                });

                page.bindToState('onLoadOptions', (key, isModifier) => {
                    const { currentComponent } = this.props;
                    loadOptions(currentComponent);
                });

                page.bindToState('onCut', (key, isModifier) => { setForCuttingKeys([key]); });
                page.bindToState('onCopy', (key, isModifier) => { setForCopyingKeys([key]); });
                page.bindToState('onClone', (key, isModifier) => { cloneSelected(); });
                page.bindToState('onDelete', (key, isModifier) => { deleteSelected(); });

                page.bindToState('onBefore', (key, isModifier) => { pasteBefore(key); });
                page.bindToState('onAfter', (key, isModifier) => { pasteAfter(key); });
                page.bindToState('onFirst', (key, isModifier) => { pasteFirst(key); });
                page.bindToState('onLast', (key, isModifier) => { pasteLast(key); });
                page.bindToState('onReplace', (key, isModifier) => { pasteReplace(key); });
                //page.bindToState('onWrap', (key, isModifier) => { pasteWrap(key); });

                page.bindToState('isMultipleSelection', () => {
                    const { selectionBreadcrumbsModel: {selectedKeys} } = this.props;
                    return selectedKeys && selectedKeys.length > 1;
                });

                page.bindToState('isAvailableToPaste', key => {
                    const { clipboardIndicatorModel: {clipboardMode} } = this.props;
                    return clipboardMode !== CLIPBOARD_CUT || graphApi.isCutPasteAvailable(key);
                });

                page.bindToState('isClipboardEmpty', () => {
                    const { clipboardIndicatorModel: {clipboardKeys} } = this.props;
                    return !clipboardKeys || clipboardKeys.length <= 0;
                });

                //page.bindToState('isAvailableToWrap', key => {
                //    const { clipboardIndicatorModel: {clipboardKeys}, selectionBreadcrumbsModel: {selectedKeys} } = this.props;
                //    return clipboardKeys && selectedKeys && clipboardKeys.length === 1 && selectedKeys.length === 1;
                //});

                page.bindToState('setDefaultVariant', (componentName, key) => {
                    setDefaultVariant(componentName, key);
                });
                page.bindToState('selectVariant', (key) => { selectVariant(key); });
                page.bindToState('hidePreview', () => { hidePreviewComponent() });

                page.bindToState('getComponentsList', () => {
                    const { libraryPanelModel: {componentsList}} = this.props;
                    return componentsList;
                });

                page.bindToState('quickBefore', (componentName, selectedKey) => {
                    quickBefore(componentName, selectedKey);
                });
                page.bindToState('quickAfter', (componentName, selectedKey) => {
                    quickAfter(componentName, selectedKey);
                });
                page.bindToState('quickFirst', (componentName, selectedKey) => {
                    quickFirst(componentName, selectedKey);
                });
                page.bindToState('quickLast', (componentName, selectedKey) => {
                    quickLast(componentName, selectedKey);
                });
                page.bindToState('quickReplace', (componentName, selectedKey) => {
                    quickReplace(componentName, selectedKey);
                });
                //page.bindToState('quickWrap', (componentName, selectedKey) => {
                //    quickWrap(componentName, selectedKey);
                //});
            };

            const initPage = () => {
                this.contentWindow.__createPageDesk();
                wait(() => this.contentWindow.pageReadyState === 'initialized', pageLoaded);
                //pageLoaded();
            };
            wait(() => this.contentWindow.pageReadyState === 'ready', initPage);
        });
    }

    componentWillUnmount(){
        this.removeShortcuts();
        this.contentDocument = undefined;
        this.contentWindow = undefined;
        this.page = undefined;
    }

    componentWillReceiveProps(nextProps){
        const { componentModel } = this.props;
        const { componentModel: newComponentModel } = nextProps;
        if(newComponentModel.reloadPageCounter != componentModel.reloadPageCounter){
            var domNode = ReactDOM.findDOMNode(this);
            domNode.src = '/structor-deskpage' + newComponentModel.currentPagePath;
        } else if(newComponentModel.pagePathToChange != null
            && newComponentModel.pagePathToChange != componentModel.pagePathToChange){
            if(this.contentWindow){
                // only when page is already loaded
                //console.log('Switching to path: ' + newComponentModel.pagePathToChange);
                this.contentWindow.__switchToPath(newComponentModel.pagePathToChange);
            }
        }
    }

    componentWillUpdate(nextProps, nextState){

        this.removeShortcuts();

        this.doUpdatePageModel = false;
        this.doUpdateMarks = false;

        const { componentModel } = this.props;
        const { componentModel: newComponentModel } = nextProps;

        if(newComponentModel.modelUpdateCounter !== componentModel.modelUpdateCounter) {
            this.doUpdatePageModel = true;
        } else if(newComponentModel.markedUpdateCounter !== componentModel.markedUpdateCounter) {
            this.doUpdateMarks = true;
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        const { componentModel } = this.props;
        const { componentModel: newComponentModel } = nextProps;
        return (
            nextProps.style.width !== this.props.style.width
            //|| newComponentModel.reloadPageCounter !== componentModel.reloadPageCounter
            //|| newComponentModel.pagePathToChange !== componentModel.pagePathToChange
            || newComponentModel.isEditModeOn !== componentModel.isEditModeOn
            || newComponentModel.markedUpdateCounter !== componentModel.markedUpdateCounter
            || newComponentModel.modelUpdateCounter !== componentModel.modelUpdateCounter
        );
    }

    componentDidUpdate(){
        this.setupShortcuts();
        if(this.page){
            if(this.doUpdatePageModel){
                const { componentModel } = this.props;
                //console.log('Updating page model: ' + componentModel.currentPagePath);
                this.page.updatePageModel({pathname: componentModel.currentPagePath});
            }
            if(this.doUpdateMarks){
                const { componentModel } = this.props;
                //console.log('Updating marked only');
                this.page.updateMarks({pathname: componentModel.currentPagePath});
            }
        }
    }

    handleComponentClick(key, isModifier){
        const { setSelectedKey } = this.props;
        setSelectedKey(key, isModifier);
    }

    handlePathnameChanged(pathname){
        const { changePageRouteFeedback } = this.props;
        changePageRouteFeedback(pathname);
    }

    handleKeyDown(e){
        //console.log('Key is down:' + e.which);
        //console.log('ActiveElement: ' + document.activeElement);

        let contentEditableElement = document.activeElement.attributes['contenteditable']
            ? document.activeElement.attributes['contenteditable'].value : false;
        let elementNameUpperCase = document.activeElement.tagName.toUpperCase();
        if(elementNameUpperCase !== 'INPUT'
            && elementNameUpperCase !== 'TEXTAREA'
            && elementNameUpperCase !== 'SELECT'
            && !contentEditableElement
            && !window.getSelection().toString()){
            if (e.which === 8 || e.which === 46) { // Del or Backspace key
                const { deleteSelected } = this.props;
                e.stopPropagation();
                e.preventDefault();
                deleteSelected();
            } else if (e.metaKey || e.ctrlKey) {
                const { selectionBreadcrumbsModel:{selectedKeys} } = this.props;
                const { clipboardIndicatorModel:{clipboardKeys} } = this.props;
                const { setForCuttingKeys, setForCopyingKeys } = this.props;
                const { pasteBefore, pasteAfter, pasteFirst } = this.props;
                const { cloneSelected, popHistory } = this.props;

                switch (e.which) {
                    case 68: // D key
                        e.stopPropagation();
                        e.preventDefault();
                        cloneSelected();
                        break;
                    case 67: // C key
                        e.stopPropagation();
                        e.preventDefault();
                        if(selectedKeys && selectedKeys.length > 0){
                            setForCopyingKeys(selectedKeys);
                        }
                        break;
                    case 65: // A key
                        e.stopPropagation();
                        e.preventDefault();
                        if(selectedKeys && selectedKeys.length === 1 && clipboardKeys && clipboardKeys.length > 0){
                            pasteBefore(selectedKeys[0]);
                        }
                        break;
                    case 73: // I key
                        e.stopPropagation();
                        e.preventDefault();
                        if(selectedKeys && selectedKeys.length === 1 && clipboardKeys && clipboardKeys.length > 0){
                            pasteFirst(selectedKeys[0]);
                        }
                        break;
                    case 86: // V key
                        e.stopPropagation();
                        e.preventDefault();
                        if(selectedKeys && selectedKeys.length === 1 && clipboardKeys && clipboardKeys.length > 0){
                            pasteAfter(selectedKeys[0]);
                        }
                        break;
                    case 88: // X key
                        e.stopPropagation();
                        e.preventDefault();
                        if(selectedKeys && selectedKeys.length > 0){
                            setForCuttingKeys(selectedKeys);
                        }
                        break;
                    case 90: // Z key
                        popHistory();
                        e.stopPropagation();
                        e.preventDefault();
                        break;
                    default:
                        break;
                }
            }
        }
    }

    setupShortcuts(){
        const { componentModel:{isEditModeOn} } = this.props;
        if(isEditModeOn){
            if(this.contentWindow){
                this.contentWindow.addEventListener('keydown', this.handleKeyDown, false);
            }
            window.addEventListener('keydown', this.handleKeyDown, false);
        } else {
            this.removeShortcuts();
        }
    }

    removeShortcuts(){
        if(this.contentWindow) {
            this.contentWindow.removeEventListener('keydown', this.handleKeyDown, false);
        }
        window.removeEventListener('keydown', this.handleKeyDown, false);
    }

    render(){
        return (<iframe {...this.props} src="/structor-deskpage" />);
    }

}

export default connect(modelSelector, containerActions)(Container);

