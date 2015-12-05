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

class OptionInput extends Component {

    constructor(props) {

        super(props);

        let valueType = 'text';
        if(props.valueObject && _.isObject(props.valueObject)){
            var value = _.get(props.valueObject, props.path);
            valueType = this.getTypeOfProperty(value);
        }
        let label = props.path.replace('.', ' / ');
        this.state = {
            valueObject: props.valueObject,
            label: label,
            propertyType: valueType
        };

        this.handleChangeInputValue = this.handleChangeInputValue.bind(this);
        this.handleChangeCheckboxValue = this.handleChangeCheckboxValue.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }

    getValueFromObject(){
        return _.get(this.state.valueObject, this.props.path);
    }

    handleChangeInputValue(e) {
        let value = null;
        if(this.state.propertyType){
            if(this.state.propertyType === 'text'){
                value = this.refs.inputElement.value;
            } else if(this.state.propertyType === 'checkbox'){
                value = this.refs.inputElement.checked;
            } else if(this.state.propertyType === 'number'){
                value = parseFloat(this.refs.inputElement.value);
            }
        }
        let valueObject = _.set({}, this.props.path, value);
        this.setState({
            valueObject: valueObject
        });
        e.persist();
        this.delayedChangeInputValue(e);
    }

    handleChangeCheckboxValue(e) {
        let value = null;
        if(this.state.propertyType){
            if(this.state.propertyType === 'checkbox'){
                value = this.refs.inputElement.checked;
            }
        }
        let valueObject = _.set({}, this.props.path, value);
        this.setState({
            valueObject: valueObject
        });
        if(this.props.onChangeValue){
            this.props.onChangeValue(valueObject);
        }

    }

    handleDelete(e){
        if(this.props.onDeleteValue){
            this.props.onDeleteValue(this.props.path);
        }
    }

    handleFocus(){
        if(this.props.onSetFocus){
            this.props.onSetFocus(this.props.path);
        }
    }

    getTypeOfProperty(propertyValue){
        if(_.isString(propertyValue)) {
            return 'text';
        } else if(_.isNumber(propertyValue)){
            return 'number';
        } else if(_.isBoolean(propertyValue)){
            return 'checkbox';
        }
    }

    componentWillMount(){
        this.delayedChangeInputValue = _.debounce((e) => {
            if(this.props.onChangeValue){
                this.props.onChangeValue(this.state.valueObject);
            }
        }, 1000);
    }

    componentDidMount(){
        if(this.props.focused){
            let input = this.refs.inputElement;
            if(this.state.propertyType !== 'checkbox') {
                let len = input.value ? input.value.length : 0;
                input.focus();
                input.setSelectionRange(len, len);
            } else {
                input.focus();
            }
        }
    }

    render() {
        let element = null;
        let style = {
            height: '1.55em', paddingTop: '2px', paddingBottom: '2px'
        };
        if(this.state.propertyType === 'checkbox') {
            style.width = '1em';
            element = (
                <div style={{position: 'relative'}}>
                <input ref="inputElement"
                       type={this.state.propertyType}
                       className="form-control"
                       checked={this.getValueFromObject()}
                       onFocus={this.handleFocus}
                       style={style}
                       onChange={this.handleChangeCheckboxValue}/>
                    <span
                        style={{position: 'absolute', top: '0.5em', left: '-1em', cursor: 'pointer'}}
                        className="fa fa-trash-o"
                        onClick={this.handleDelete}></span>
                </div>
            );

        } else if(this.state.propertyType === 'text' || this.state.propertyType === 'number') {
            element = (
                <div style={{position: 'relative'}}>
                    <input ref="inputElement"
                           type={this.state.propertyType}
                           className="form-control"
                           value={this.getValueFromObject()}
                           style={style}
                           onFocus={this.handleFocus}
                           onChange={this.handleChangeInputValue}/>
                    <span
                        style={{position: 'absolute', top: '0.5em', left: '-1em', cursor: 'pointer'}}
                        className="fa fa-trash-o"
                        onClick={this.handleDelete}></span>
                </div>
            );
        }

        return (
            <div {...this.props}>
                <p style={{marginBottom: '3px'}}>{this.state.label}</p>
                {element}
            </div>
        );
    }

}

OptionInput.defaultProps = {
    valueObject: null,
    label: 'Option:'
};

module.exports = OptionInput;