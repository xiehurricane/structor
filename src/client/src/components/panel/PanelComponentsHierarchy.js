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

import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, Button, Nav, CollapsibleNav,
    Navbar, DropdownButton, MenuItem, NavItem } from 'react-bootstrap';

import * as DeskPageActions from '../../actions/deskPageActions.js';

import PanelComponentHierarchyItem from './PanelComponentHierarchyItem.js';
import PanelComponentHierarchyTextItem from './PanelComponentHierarchyTextItem.js';
import OverlayButtonsControl from '../element/OverlayButtonsControl.js';

import * as DeskActions from '../../actions/deskActions.js';

var scrollToSelected = function($frameWindow){
    setTimeout((function(_frameWindow){
        return function(){
            let $selected = _frameWindow.find(".bg-info");
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

class PanelComponentsHierarchy extends Component{

    constructor(props) {
        super(props);
        //this.state = {};
        this.handleChangeInlineText = this.handleChangeInlineText.bind(this);
    }

    componentDidMount() {
        this.$frameWindow = $(this.refs.panelComponentsHierarchyElement);
        scrollToSelected(this.$frameWindow);
    }

    componentDidUpdate(){
        if(this.props.selectedUmyId){
            scrollToSelected(this.$frameWindow);
        }
    }

    componentWillUnmount() {
        this.$frameWindow = null;
    }

    handleChangeInlineText(textValue){
        this.props.rewriteModelNode({
            text: _.unescape(textValue)
        })
    }

    render() {

        const { currentPageIndex, projectModel } = this.props;

        let style = {
            //display: this.props.displayStyle,
            padding: '2em 1em 1em 1em',
            height: '100%',
            overflow: 'auto',
            border: '1px solid #DBDBDB',
            borderRadius: '3px'
        };
        //console.log('Component hierarchy starts from page index: ' + currentPageIndex + ' from ' + projectModel.pages.length);
        let pageModel = projectModel.pages[currentPageIndex];

        let listItems = [];
        if(pageModel){
            if (pageModel.props){
                _.forOwn(pageModel.props, (value, prop) => {
                    if(_.isObject(value) && value.type){
                        listItems.push(this.buildNode(value));
                    }
                });
            }
            if (pageModel.children && pageModel.children.length > 0) {
                pageModel.children.forEach( child => {
                    listItems.push(this.buildNode(child));
                });
            }
        }

        let containerStyle = {
            position: 'absolute',
            left: '4em',
            right: '4em',
            top: '2px',
            zIndex: 1030
        };
        let overlay = (<div style={containerStyle}><OverlayButtonsControl /></div>);

        //
        return (
            <div ref="panelComponentsHierarchyElement" style={style}>
                <Button bsSize='xsmall'
                        style={
                            {
                                padding: '0.2em',
                                position: 'absolute',
                                top: '2px',
                                left: '2px',
                                width: '2em',
                                height: '2em',
                                zIndex: '1030'
                            }
                        }
                        onClick={this.props.toggleComponentsHierarchy}>
                    <span className='fa fa-times fa-fw'></span>
                </Button>
                {overlay}
                <ul className='umy-treeview-list' style={{border: 0}}>
                    {listItems}
                </ul>
            </div>
        );
    }

    buildNode(rootItem) {
        let inner = [];
        let umyId = rootItem.props['data-umyid'];
        const {selectedUmyId, selectedUmyIdToCopy, selectedUmyIdToCut} = this.props;

        let isSelected = (selectedUmyId === umyId);
        let isCopyMark = (selectedUmyIdToCopy === umyId);
        let isCutMark = (selectedUmyIdToCut === umyId);

        if (rootItem.text) {
            inner.push(
                <PanelComponentHierarchyTextItem
                    umyid={umyId}
                    isSelected={isSelected}
                    key={'text' + umyId}
                    textValue={rootItem.text}
                    onChangeText={this.handleChangeInlineText}
                    onSelect={this.props.setComponentSelection} />
            )
        }
        let innerProps = [];
        if (rootItem.props){
            _.forOwn(rootItem.props, (value, prop) => {
                if(_.isObject(value) && value.type){
                    innerProps.push(this.buildNode(value));
                }
            });
        }
        let children = [];
        if (rootItem.children && rootItem.children.length > 0) {
            rootItem.children.forEach( child => {
                children.push(this.buildNode(child));
            });
        }
        if(innerProps.length > 0 || children.length > 0){
            inner.push(
                <ul key={'list' + umyId} className='umy-treeview-list'>
                    {innerProps}
                    {children}
                </ul>
            );
        }

        return (
            <PanelComponentHierarchyItem
                key={'listitem' + umyId}
                umyid={umyId}
                isSelected={isSelected}
                isCopyMark={isCopyMark}
                isCutMark={isCutMark}
                type={rootItem.type}
                onSelect={this.props.setComponentSelection}>
                {inner}
            </PanelComponentHierarchyItem>
        );
    }

}

function mapStateToProps(state) {
    const { deskPage } = state;
    return {
        projectModel: deskPage.model,
        currentPageIndex: deskPage.currentPageIndex,
        selectedUmyId: deskPage.selectedUmyId,
        selectedUmyIdToCopy: deskPage.selectedUmyIdToCopy,
        selectedUmyIdToCut: deskPage.selectedUmyIdToCut
    };
}

export default connect(
    mapStateToProps,
    {
        toggleComponentsHierarchy: DeskActions.toggleComponentsHierarchy,
        setComponentSelection: DeskPageActions.setComponentSelection,
        rewriteModelNode: DeskPageActions.rewriteModelNode
    }
)(PanelComponentsHierarchy);

