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

import {isObject, isString, isNumber, isBoolean, get, set, debounce} from 'lodash';
import React, { Component, PropTypes } from 'react';

class OptionInput extends Component {

    constructor(props) {

        super(props);

        let valueType = 'text';
        if(props.valueObject && isObject(props.valueObject)){
            var value = get(props.valueObject, props.path);
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

    componentWillReceiveProps(nextProps){
        const {valueObject, path} = nextProps;
        let valueType = 'text';
        let value;
        if(valueObject && isObject(valueObject)){
            value = get(valueObject, path);
            valueType = this.getTypeOfProperty(value);
        }
        let label = path.replace('.', ' / ');
        this.setState({
            valueObject: valueObject,
            label: label,
            propertyType: valueType
        });
    }

    componentWillMount(){
        this.delayedChangeInputValue = debounce((e) => {
            if(this.props.onChangeValue){
                this.props.onChangeValue(this.state.valueObject);
            }
        }, 1000);
    }

    componentWillUnmount(){
        this.delayedChangeInputValue.cancel;
    }

    getValueFromObject(){
        return get(this.state.valueObject, this.props.path);
    }

    handleChangeInputValue(e) {
        let value = null;
        const {propertyType} = this.state;
        const {inputElement} = this.refs;
        if(propertyType){
            if(propertyType === 'text'){
                value = inputElement.value;
            } else if(propertyType === 'checkbox'){
                value = inputElement.checked;
            } else if(propertyType === 'number'){
                value = parseFloat(inputElement.value);
            }
        }
        let valueObject = set({}, this.props.path, value);
        this.setState({
            valueObject: valueObject
        });
        e.persist();
        this.delayedChangeInputValue(e);
    }

    handleChangeCheckboxValue(e) {
        let value = null;
        const {propertyType} = this.state;
        const {path, onChangeValue} = this.props;
        if(propertyType){
            if(propertyType === 'checkbox'){
                value = this.refs.inputElement.checked;
            }
        }
        let valueObject = set({}, path, value);
        this.setState({
            valueObject: valueObject
        });
        if(onChangeValue){
            onChangeValue(valueObject);
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
        if(isString(propertyValue)) {
            return 'text';
        } else if(isNumber(propertyValue)){
            return 'number';
        } else if(isBoolean(propertyValue)){
            return 'checkbox';
        }
    }

    render() {
        const {propertyType, label} = this.state;
        let element = null;
        let style = {
            height: '1.55em', paddingTop: '2px', paddingBottom: '2px'
        };
        if(propertyType === 'checkbox') {
            style.width = '1em';
            element = (
                <div style={{position: 'relative'}}>
                <input ref="inputElement"
                       type={propertyType}
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

        } else if(propertyType === 'text' || propertyType === 'number') {
            element = (
                <div style={{position: 'relative'}}>
                    <input ref="inputElement"
                           type={propertyType}
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
                <p style={{marginBottom: '3px'}}>{label}</p>
                {element}
            </div>
        );
    }

}

OptionInput.propTypes = {
    valueObject: PropTypes.any,
    label: PropTypes.string
};

OptionInput.defaultProps = {
    valueObject: null,
    label: 'Option:'
};

export default OptionInput;