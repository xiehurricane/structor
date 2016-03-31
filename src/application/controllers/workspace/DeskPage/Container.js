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

import { utilsStore, graphApi } from '../../../api/index.js';

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleComponentClick = this.handleComponentClick.bind(this);
        this.handlePathnameChanged = this.handlePathnameChanged.bind(this);
    }

    componentDidMount(){
        const domNode = ReactDOM.findDOMNode(this);
        const {loadPage, pageLoaded} = this.props;
        const { setSelectedParentKey, setForCuttingKeys, pasteBefore, pasteAfter, pasteFirst, pasteLast } = this.props;
        loadPage();
        domNode.onload = ( () => {

            this.contentDocument = domNode.contentDocument;
            this.contentWindow = domNode.contentWindow;
            if(this.contentWindow.pageReadyState !== 'initialized'){

                this.contentWindow.onPageDidMount = (page, pathname) => {
                    this.page = page;
                    page.setGraphApi(graphApi);
                    page.setOnComponentMouseDown(this.handleComponentClick);
                    page.setOnPathnameChanged(this.handlePathnameChanged);

                    page.bindToState('onSelectParent', setSelectedParentKey);
                    page.bindToState('onCut', (key, isModifier) => { setForCuttingKeys([key]) });
                    page.bindToState('onBefore', (key, isModifier) => { pasteBefore(key) });
                    page.bindToState('onAfter', (key, isModifier) => { pasteAfter(key) });
                    page.bindToState('onFirst', (key, isModifier) => { pasteFirst(key) });
                    page.bindToState('onLast', (key, isModifier) => { pasteLast(key) });

                    const { componentModel } = this.props;
                    page.updatePageModel({
                        pathname: pathname,
                        isEditModeOn: componentModel.isEditModeOn
                    });
                };

                this.contentWindow.__createPageDesk();
            }
            pageLoaded();
        });
    }

    componentWillUpdate(nextProps, nextState){

        console.log('DeskPage will update...');

        this.doUpdatePageModel = false;
        this.doUpdateSelected = false;

        const { componentModel } = this.props;
        const { componentModel: newComponentModel } = nextProps;

        if(newComponentModel.reloadPageCounter != componentModel.reloadPageCounter){
            var domNode = ReactDOM.findDOMNode(this);
            domNode.src = '/deskpage' + componentModel.currentPagePath;
        } else if(newComponentModel.currentPagePath != componentModel.currentPagePath){
            console.log('Switching to path: ' + newComponentModel.currentPagePath);
            this.contentWindow.__switchToPath(newComponentModel.currentPagePath);
        } else if(newComponentModel.modelUpdateCounter !== componentModel.modelUpdateCounter) {
            this.doUpdatePageModel = true;
        } else if(newComponentModel.selectedUpdateCounter !== componentModel.selectedUpdateCounter) {
            this.doUpdateSelected = true;
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        const { componentModel } = this.props;
        const { componentModel: newComponentModel } = nextProps;
        return (
            nextProps.style.width !== this.props.style.width
            || newComponentModel.reloadPageCounter !== componentModel.reloadPageCounter
            || newComponentModel.currentPagePath !== componentModel.currentPagePath
            || newComponentModel.isEditModeOn !== componentModel.isEditModeOn
            || newComponentModel.selectedUpdateCounter !== componentModel.selectedUpdateCounter
            || newComponentModel.modelUpdateCounter !== componentModel.modelUpdateCounter
        );
    }

    componentDidUpdate(){
        if(this.page){
            if(this.doUpdatePageModel){
                const { componentModel } = this.props;
                console.log('Updating page model: ' + componentModel.currentPagePath);
                this.page.updatePageModel({
                    pathname: componentModel.currentPagePath,
                    isEditModeOn: componentModel.isEditModeOn
                });
            }
            if(this.doUpdateSelected){
                console.log('Updating selected only');
                this.page.updateInitialState();
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

    render(){
        return (<iframe {...this.props} src="/deskpage/" />);
    }

}

export default connect(modelSelector, containerActions)(Container);

