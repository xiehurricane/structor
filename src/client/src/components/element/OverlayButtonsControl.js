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

import * as DeskPageActions from '../../actions/deskPageActions.js';
import { toggleComponentsHierarchy } from '../../actions/deskActions.js';
import { showModalComponentEditor } from '../../actions/modalComponentEditorActions.js';
import { showModalComponentGenerator } from '../../actions/modalComponentGeneratorActions.js';
import { showModalComponentVariant } from '../../actions/modalComponentVariantActions.js';

import * as Utils from '../../api/utils.js';
import * as UtilStore from '../../api/utilStore.js';
import { createComponentOverlay, createCopyPasteOverlay } from '../../api/overlays.js';

import OverlayTreeviewItem from './OverlayTreeviewItem.js';
import OverlayTreeviewItemPaste from './OverlayTreeviewItemPaste.js';

class OverlayButtonsControl extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState){
        return (
            this.props.selectComponentCounter < nextProps.selectComponentCounter
            || this.props.isDomNodeInCurrentPage !== nextProps.isDomNodeInCurrentPage
            || this.props.clipboardMode !== nextProps.clipboardMode
            || this.props.selectedUmyIdToCopy !== nextProps.selectedUmyIdToCopy
            || this.props.selectedUmyIdToCut !== nextProps.selectedUmyIdToCut
            || this.props.quickPasteModeInModelByName !== nextProps.quickPasteModeInModelByName
        );
    }

    componentWillUpdate(nextProps, nextState){
        //let thisDOMNode = React.findDOMNode(this);
        //$(thisDOMNode).find('[data-toggle="tooltip"]').tooltip('destroy');
    }

    componentDidUpdate(){
        const { isGlobalOverlay } = this.props;
        if(isGlobalOverlay){
            const { selectedUmyId, searchResult, isDomNodeInCurrentPage, clipboardMode } = this.props;
            if(isDomNodeInCurrentPage && selectedUmyId && searchResult){
                const frameWindow = UtilStore.getFrameWindow();
                const DOMNode = UtilStore.getPageDomNode(selectedUmyId);
                if(frameWindow && DOMNode && searchResult){
                    let plugin = null;
                    if(clipboardMode !== 'EMPTY_MODE'){
                        if(clipboardMode === 'ADD_NEW_MODE' || clipboardMode === 'COPY_MODE'){
                            plugin = createCopyPasteOverlay(
                                {
                                    onClose: this.props.discardComponentSelection,
                                    onAddBefore: () => {
                                        this.props.pasteInModelFromClipboard('addBefore');
                                    },
                                    onInsertFirst: () => {
                                        this.props.pasteInModelFromClipboard('insertFirst');
                                    },
                                    onWrap: () => {
                                        this.props.pasteInModelFromClipboard('wrap');
                                    },
                                    onReplace: () => {
                                        this.props.pasteInModelFromClipboard('replace');
                                    },
                                    onInsertLast: () => {
                                        this.props.pasteInModelFromClipboard('insertLast');
                                    },
                                    onAddAfter: () => {
                                        this.props.pasteInModelFromClipboard('addAfter');
                                    },
                                    onCancel: this.props.discardClipboard
                                },
                                frameWindow,
                                searchResult.found.type
                            );
                        } else if(clipboardMode === 'CUT_MODE') {
                            plugin = createCopyPasteOverlay(
                                {
                                    onClose: this.props.discardComponentSelection,
                                    onAddBefore: () => {
                                        this.props.pasteDeleteInModelFromClipboard('addBefore');
                                    },
                                    onInsertFirst: () => {
                                        this.props.pasteDeleteInModelFromClipboard('insertFirst');
                                    },
                                    onWrap: () => {
                                        this.props.pasteDeleteInModelFromClipboard('wrap');
                                    },
                                    onReplace: () => {
                                        this.props.pasteDeleteInModelFromClipboard('replace');
                                    },
                                    onInsertLast: () => {
                                        this.props.pasteDeleteInModelFromClipboard('insertLast');
                                    },
                                    onAddAfter: () => {
                                        this.props.pasteDeleteInModelFromClipboard('addAfter');
                                    },
                                    onCancel: this.props.discardClipboard
                                },
                                frameWindow,
                                searchResult.found.type
                            );
                        } else {
                            plugin = createCopyPasteOverlay(
                                {
                                    onClose: this.props.discardComponentSelection,
                                    onCancel: this.props.discardClipboard
                                },
                                frameWindow,
                                searchResult.found.type
                            );
                        }
                    } else {
                        //console.log('Create component global overlay...');
                        plugin = createComponentOverlay(
                            {
                                menu: [
                                    {
                                        label: 'Save as new variant', onClick: () => { this.props.showModalComponentVariant() }
                                    },
                                    {
                                        label: '_divider'
                                    },
                                    {
                                        label: 'Generate source code', onClick: () => { this.props.showModalComponentGenerator() }
                                    }
                                ],
                                onClose: this.props.discardComponentSelection,
                                onClick: () => { this.props.showModalComponentEditor() },
                                onCodeView: () => { this.props.toggleComponentsHierarchy() },
                                onMoveUp: () => { this.props.moveInModelSelected('UP'); },
                                onMoveDown: () => { this.props.moveInModelSelected('DOWN'); },
                                onCopy: () => { this.props.copySelectedInClipboard(); },
                                onCut: () => { this.props.cutSelectedInClipboard(); },
                                onDuplicate: () => { this.props.duplicateInModelSelected(); },
                                onOptions: () => { this.props.showModalComponentEditor() },
                                onDelete: this.props.deleteInModelSelected
                            },
                            frameWindow,
                            selectedUmyId,
                            searchResult.found.type,
                            {exProps: searchResult.foundProp}
                        );
                    }
                    UtilStore.setCurrentOverlayPlugin(plugin);
                    plugin.append(DOMNode);
                }
            } else {
                UtilStore.destroyCurrentOverlayPlugin();
            }
        }
        //let thisDOMNode = React.findDOMNode(this);
        //$(thisDOMNode).find('[data-toggle="tooltip"]').tooltip({delay: { "show": 500, "hide": 100 }, container: 'body'});
    }

    componentWillUnmount(){
        const { isGlobalOverlay } = this.props;
        if(isGlobalOverlay) {
            UtilStore.destroyCurrentOverlayPlugin();
        }
        //console.log('OverlayButtonsControl will unmount');
    }

    render(){
        const { selectedUmyId, searchResult, isDomNodeInCurrentPage, clipboardMode } = this.props;
        if(isDomNodeInCurrentPage && selectedUmyId && searchResult){
            if(clipboardMode !== 'EMPTY_MODE'){
                if(clipboardMode === 'ADD_NEW_MODE' || clipboardMode === 'COPY_MODE'){
                    return (<OverlayTreeviewItemPaste
                        isFullFledged={this.props.isFullFledged}
                        onClose={this.props.discardComponentSelection}
                        onAddBefore={ () => { this.props.pasteInModelFromClipboard('addBefore'); } }
                        onInsertFirst={ () => { this.props.pasteInModelFromClipboard('insertFirst'); } }
                        onWrap={ () => { this.props.pasteInModelFromClipboard('wrap'); } }
                        onReplace={ () => { this.props.pasteInModelFromClipboard('replace'); } }
                        onInsertLast={ () => { this.props.pasteInModelFromClipboard('insertLast'); } }
                        onAddAfter={ () => { this.props.pasteInModelFromClipboard('addAfter'); } }
                        onCancel={ () => { this.props.discardClipboard(); } } />);
                } else if(clipboardMode === 'CUT_MODE') {
                    return (<OverlayTreeviewItemPaste
                        isFullFledged={this.props.isFullFledged}
                        onClose={this.props.discardComponentSelection}
                        onAddBefore={ () => { this.props.pasteDeleteInModelFromClipboard('addBefore'); } }
                        onInsertFirst={ () => { this.props.pasteDeleteInModelFromClipboard('insertFirst'); } }
                        onWrap={ () => { this.props.pasteDeleteInModelFromClipboard('wrap'); } }
                        onReplace={ () => { this.props.pasteDeleteInModelFromClipboard('replace'); } }
                        onInsertLast={ () => { this.props.pasteDeleteInModelFromClipboard('insertLast'); } }
                        onAddAfter={ () => { this.props.pasteDeleteInModelFromClipboard('addAfter'); } }
                        onCancel={ () => { this.props.discardClipboard(); } } />);

                } else {
                    return (<OverlayTreeviewItemPaste
                        isFullFledged={this.props.isFullFledged}
                        onClose={this.props.discardComponentSelection}
                        onAddBefore={ () => { alert('Unknown clipboard mode !'); } }
                        onInsertFirst={ () => { alert('Unknown clipboard mode !'); } }
                        onWrap={ () => { alert('Unknown clipboard mode !'); } }
                        onReplace={ () => { alert('Unknown clipboard mode !'); } }
                        onInsertLast={ () => { alert('Unknown clipboard mode !'); } }
                        onAddAfter={ () => { alert('Unknown clipboard mode !'); } }
                        onCancel={ () => { this.props.discardClipboard(); } } />);

                }
            } else {
                return (<OverlayTreeviewItem
                    selectedUmyId={selectedUmyId}
                    searchResult={searchResult}
                    quickPasteModeInModelByName={this.props.quickPasteModeInModelByName}
                    isFullFledged={this.props.isFullFledged}
                    onClose={this.props.discardComponentSelection}
                    onMoveUp={ () => { this.props.moveInModelSelected('UP'); } }
                    onMoveDown={ () => { this.props.moveInModelSelected('DOWN'); } }
                    onCut={ () => { this.props.cutSelectedInClipboard(); } }
                    onCopy={ () => { this.props.copySelectedInClipboard(); } }
                    onDuplicate={ () => { this.props.duplicateInModelSelected(); } }
                    onOptions={ () => { this.props.showModalComponentEditor() } }
                    onDelete={this.props.deleteInModelSelected}
                    onStartQuickPaste={ pasteMode => this.props.startQuickPasteInModelByName(pasteMode) }
                    onStopQuickPaste={ () => this.props.stopQuickPasteInModelByName() }
                    onQuickPaste={ (componentName, pasteMode) => { this.props.quickPasteInModelByName(componentName, pasteMode); } } />);
            }
        } else {
            return (<span></span>);
        }
    }
}

OverlayButtonsControl.defaultProps = {
    isGlobalOverlay: false,
    isFullFledged: true
};


function mapStateToProps(state) {
    const { deskPage } = state;
    return {
        selectedUmyId: deskPage.selectedUmyId,
        selectComponentCounter: deskPage.selectComponentCounter,
        searchResult: deskPage.searchResult,
        isDomNodeInCurrentPage: deskPage.isDomNodeInCurrentPage,
        clipboardMode: deskPage.clipboardMode,
        selectedUmyIdToCopy: deskPage.selectedUmyIdToCopy,
        selectedUmyIdToCut: deskPage.selectedUmyIdToCut,
        quickPasteModeInModelByName: deskPage.quickPasteModeInModelByName
    };
}

let mappedActions = Object.assign({}, DeskPageActions,
    {
        showModalComponentEditor: showModalComponentEditor,
        showModalComponentGenerator: showModalComponentGenerator,
        toggleComponentsHierarchy: toggleComponentsHierarchy,
        showModalComponentVariant: showModalComponentVariant
    }
);

export default connect(
    mapStateToProps,
    mappedActions
)(OverlayButtonsControl);

