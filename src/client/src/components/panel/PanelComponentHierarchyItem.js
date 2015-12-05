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

class PanelComponentHierarchyItem extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.props.onSelect){
            this.props.onSelect(this.props.umyid);
        }
    }

    render(){

        let content = null;

        const { isSelected, isCopyMark, isCutMark } = this.props;

        var className = 'umy-treeview-list-item' + (isSelected ? ' bg-info' : '');
        if(isCopyMark){
            className += ' umy-grid-basic-border-copy';
        }
        if(isCutMark){
            className += ' umy-grid-basic-border-cut';
        }

        let linkClassName = '';
        let label = this.props.type;

        if(this.props.children && this.props.children.length > 0){
            content = (
                <li className={className}>
                    <a key={'toplink'} className={linkClassName} href="#" onClick={this.handleClick}>
                        <span>{'<' + label + '>'}</span>
                    </a>
                    {this.props.children}
                    <a key={'bottomlink'} className={linkClassName} href="#" onClick={this.handleClick}>
                        <span>{'</' + label + '>'}</span>
                    </a>
                </li>
            );
        } else {
            content = (
                <li className={className}>
                    <a  className={linkClassName} href="#" onClick={this.handleClick}>
                        <span>{'<' + label + ' />'}</span>
                    </a>
                </li>
            );
        }

        return content;
    }

}

export default PanelComponentHierarchyItem;

