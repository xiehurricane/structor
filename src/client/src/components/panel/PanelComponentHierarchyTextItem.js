import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Panel, Button, Nav, CollapsibleNav,
    Navbar, DropdownButton, MenuItem, NavItem } from 'react-bootstrap';

import ContentEditable from '../element/ContentEditable.js';

class PanelComponentHierarchyTextItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            textValue: this.props.textValue,
            isEditable: false
        };
        this.handleTextClick = this.handleTextClick.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleTextClick(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.props.onSelect){
            this.props.onSelect(this.props.umyid);
        }
        this.setState({
            isEditable: true
        });
    }

    handleBlur(e){
        this.props.onChangeText(e.target.value);
        this.setState({
            isEditable: false
        });
    }

    handleChange(e){
        this.setState({
            textValue: e.target.value
        });
    }

    componentDidMount(){
        if(this.state.isEditable === true){
            $(this.refs.textItemElement).focus();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            textValue: nextProps.textValue
        });
    }

    render(){

        let content = null;
        if(this.state.isEditable === true){
            content = (
                <span
                    ref="textItemElement"
                    className='text-muted'
                    style={{position: 'relative'}}>

                    {this.props.textValue}

                    <ContentEditable
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        html={this.state.textValue} />
                </span>
            );
        } else {
            content = (
                <span
                    ref="textItemElement"
                    className='text-muted'
                    onClick={this.handleTextClick}>

                    {this.props.textValue}
                </span>
            );
        }

        return content;
    }


}

PanelComponentHierarchyTextItem.propTypes = {
    onChangeText: PropTypes.func.isRequired
};

export default PanelComponentHierarchyTextItem;


