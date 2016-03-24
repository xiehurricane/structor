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
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { forOwn } from 'lodash';
import { componentModel } from './selectors.js';
import * as actions from './actions.js';

import { utilsStore, graphApi } from '../../../api/index.js';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        const domNode = ReactDOM.findDOMNode(this);
        const {loadPage, pageLoaded} = this.props;
        loadPage();
        domNode.onload = ( () => {

            this.contentDocument = domNode.contentDocument;
            this.contentWindow = domNode.contentWindow;
            if(this.contentWindow.pageReadyState !== 'initialized'){

                this.contentWindow.onPageDidMount = () => {
                    console.log('PageForDesk was mounted');
                };
                this.contentWindow.onPageWillUnmount = () => {
                    const {componentModel} = this.props;
                    console.log('PageForDesk will unmount');
                    console.log('componentModel.isEditModeOn ' + componentModel.isEditModeOn);
                    if(componentModel.isEditModeOn){
                        this.clearDomNodes();
                    }
                };
                this.contentWindow.onPageDidUpdate = () => {
                    const {componentModel} = this.props;
                    console.log('PageForDesk did update');
                    console.log('componentModel.isEditModeOn ' + componentModel.isEditModeOn);
                    if(componentModel.isEditModeOn){
                        this.mapDomNodes();
                    }
                };
                this.contentWindow.onPageWillUpdate = () => {
                    const {componentModel} = this.props;
                    console.log('PageForDeak will update');
                    console.log('componentModel.isEditModeOn ' + componentModel.isEditModeOn);
                    if(componentModel.isEditModeOn){
                        this.clearDomNodes();
                    }
                };

                this.contentWindow.__createPageDesk(graphApi);
            }
            pageLoaded();
        });
    }

    componentWillUpdate(nextProps, nextState){

        this.doUpdatePageModel = false;
        this.contentWindow.Page.setGraph(graphApi);

        const { componentModel } = this.props;
        const { componentModel: newComponentModel } = nextProps;
        if(newComponentModel.reloadPageCounter != componentModel.reloadPageCounter){
            const {started} = this.props;
            var domNode = ReactDOM.findDOMNode(this);
            domNode.src = '/deskpage' + componentModel.currentPagePath;
        } else if(newComponentModel.currentPagePath != componentModel.currentPagePath){
            this.contentWindow.__switchToPath(newComponentModel.currentPagePath);
        } else {
            this.doUpdatePageModel = true;
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        const { componentModel } = this.props;
        const { componentModel: newComponentModel } = nextProps;
        return (
            newComponentModel.reloadPageCounter != componentModel.reloadPageCounter
            || newComponentModel.currentPagePath != componentModel.currentPagePath
            || newComponentModel.isEditModeOn != componentModel.isEditModeOn
        );
    }

    componentDidUpdate(){
        if(this.doUpdatePageModel){
            const { componentModel } = this.props;
            this.contentWindow.Page.updatePageModel(componentModel.currentPagePath);
        }
    }

    clearDomNodes(){
        const nodeMap = utilsStore.getPageDomNodeMap();
        forOwn(nodeMap, (node, key) => {
            if(node){
                $(node).off("mousedown.umy");
            }
        });
        //if(this.contentWindow) {
        //    this.contentWindow.removeEventListener('keydown', this.handleKeyDown, false);
        //}
        //window.removeEventListener('keydown', this.handleKeyDown, false);
        utilsStore.resetPageDomNode();
        utilsStore.resetFrameWindow();

    }

    mapDomNodes(){
        if(this.contentWindow && this.contentWindow.Page){
            this.clearDomNodes();
            utilsStore.setFrameWindow(this.contentWindow);
            const instanceMap = this.contentWindow.Page.getInstanceMap();
            forOwn(instanceMap, (DOMNode, key) => {
                utilsStore.setPageDomNode(key, DOMNode);
                $(DOMNode).on("mousedown.umy", ((_dataumyid, cb) => {
                    return (e) => {
                        if(!e.metaKey && !e.ctrlKey){
                            e.stopPropagation();
                            e.preventDefault();
                            cb(_dataumyid);
                        }
                    };
                })(key, (umyId) => {alert('Clicked on ' + umyId)}));
            });

            //this.props.setComponentSelection();
            //this.contentWindow.addEventListener('keydown', this.handleKeyDown, false);
            //window.addEventListener('keydown', this.handleKeyDown, false);

        }
    }

    render(){
        return (<iframe {...this.props} src="/deskpage/" />);
    }

}


export default connect(
    createStructuredSelector({componentModel}),
        dispatch => bindActionCreators(actions, dispatch)
)(Container)

