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

import {forOwn, difference} from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { graphApi } from '../../../api';
import { PageTreeViewItem, PageTreeViewItemText } from '../../../views/index.js';
import PageTreeViewPlaceholder from '../../../views/workspace/PageTreeViewPlaceholder.js';
import {CLIPBOARD_EMPTY} from '../ClipboardIndicator/actions.js';

var scrollToSelected = function($frameWindow, key){
    setTimeout((function(_frameWindow){
        return function(){
            let $selected = _frameWindow.find('#' + key);
            if($selected && $selected.length > 0){
                var diff = ($selected.offset().top + _frameWindow.scrollTop()) - _frameWindow.offset().top;
                var margin = parseInt(_frameWindow.css("height"))/5;
                //_frameWindow[0].scrollTop = (diff - margin);
                //console.log("Scroll to " + (diff - margin));
                _frameWindow.animate(
                    { scrollTop: (diff - margin) },
                    300
                );
                diff = null;
                margin = null;
            }
            $selected = null;
        }
    })($frameWindow), 0);
};

class Container extends Component{

    constructor(props) {
        super(props);
        this.shouldScroll = true;
        this.scrollToSelected = this.scrollToSelected.bind(this);
    }

    componentDidMount() {
        this.$frameWindow = $(this.refs.panelElement);
        this.scrollToSelected();
    }

    componentDidUpdate(){
        this.scrollToSelected();
    }

    componentWillUnmount() {
        this.$frameWindow = undefined;
    }

    shouldComponentUpdate(nextProps, nextState){

        const { deskPageModel } = this.props;
        const { deskPageModel: newDeskPageModel } = nextProps;

        this.shouldScroll = newDeskPageModel.markedUpdateCounter !== deskPageModel.markedUpdateCounter;
        return (
            newDeskPageModel.reloadPageCounter !== deskPageModel.reloadPageCounter
            || newDeskPageModel.currentPagePath !== deskPageModel.currentPagePath
            || newDeskPageModel.markedUpdateCounter !== deskPageModel.markedUpdateCounter
            || newDeskPageModel.modelUpdateCounter !== deskPageModel.modelUpdateCounter
        );
    }

    scrollToSelected(){
        if(this.shouldScroll === true){
            const selectedKeys = this.props.currentSelectedKeys;
            if(selectedKeys && selectedKeys.length > 0){
                scrollToSelected(this.$frameWindow, selectedKeys[selectedKeys.length - 1]);
            }
        }
    }

    buildNode = (graphNode) => {

        let inner = [];
        const modelNode = graphNode.modelNode;
        const {clipboardMode, pasteAfter, pasteBefore, changeText, setSelectedKey} = this.props;

        let innerProps = [];
        if(graphNode.props){
            forOwn(graphNode.props, (prop, propName) => {
                innerProps.push(this.buildNode(prop));
            });
        }
        let children = [];
        if(graphNode.children && graphNode.children.length > 0){
            graphNode.children.forEach(node => {
                children.push(this.buildNode(node));
                if(clipboardMode !== CLIPBOARD_EMPTY){
                    children.push(
                        <PageTreeViewPlaceholder
                            key={'treeItemPlaceholder' + node.key}
                            itemKey={node.key}
                            onClick={pasteAfter} />
                    );
                }
            });
        } else if(modelNode.text !== undefined) {
            inner.push(
                <PageTreeViewItemText
                    itemKey={graphNode.key}
                    key={'text' + graphNode.key}
                    onChangeText={(text) => {changeText(text, graphNode.key);}}
                    textValue={modelNode.text} />
            )
        }

        if(innerProps.length > 0 || children.length > 0){
            inner.push(
                <ul id={graphNode.key}
                    key={'list' + graphNode.key}
                    className={graphNode.selected ? 'umy-treeview-list-selected' : 'umy-treeview-list'}>
                    {innerProps}
                    {clipboardMode !== CLIPBOARD_EMPTY && graphNode.children && graphNode.children.length > 0 &&
                        <PageTreeViewPlaceholder
                            key={'firstItemPlaceholder' + graphNode.children[0].key}
                            itemKey={graphNode.children[0].key}
                            onClick={pasteBefore} />
                    }
                    {children}
                </ul>
            );
        }

        return (
            <PageTreeViewItem
                key={'treeItem' + graphNode.key}
                itemKey={graphNode.key}
                isSelected={graphNode.selected}
                isForCutting={graphNode.isForCutting}
                isForCopying={graphNode.isForCopying}
                type={modelNode.type}
                modelProps={modelNode.props}
                onSelect={setSelectedKey}>
                {inner}
            </PageTreeViewItem>
        );
    };

    render() {

        const { deskPageModel, clipboardMode } = this.props;
        const pageGraph = graphApi.getWrappedModelByPagePath(deskPageModel.currentPagePath);

        let style = {
            padding: '2em 1em 1em 2em',
            height: '100%',
            overflow: 'auto',
            border: '1px solid #DBDBDB',
            borderRadius: '3px',
            position: 'relative'
        };

        let listItems = [];
        if(pageGraph){
            let length = pageGraph.children.length;
            pageGraph.children.forEach((child, index) => {
                listItems.push(this.buildNode(child));
                if(clipboardMode !== CLIPBOARD_EMPTY){
                    listItems.push(
                        <PageTreeViewPlaceholder
                            key={'treeItemPlaceholder' + child.key}
                            isTopLevelPlace={true}
                            itemKey={child.key}
                            onClick={this.props.pasteAfter} />
                    );
                }
            });
        }

        return (
            <div ref="panelElement" style={style}>
                <ul className='umy-treeview-list' style={{border: 0}}>
                    {clipboardMode !== CLIPBOARD_EMPTY && pageGraph.children.length > 0 &&
                        <PageTreeViewPlaceholder
                            key={'firstItemPlaceholder'}
                            isTopLevelPlace={true}
                            itemKey={pageGraph.children[0].key}
                            onClick={this.props.pasteBefore} />
                    }
                   {listItems}
                </ul>
            </div>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);

