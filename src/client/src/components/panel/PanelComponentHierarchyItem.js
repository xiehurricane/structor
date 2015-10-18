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

