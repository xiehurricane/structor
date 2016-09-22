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
import { Input } from 'react-bootstrap';

class InputTextStateful extends Component {

    constructor(props, content) {
        super(props, content);
        this.state = {
            value: this.props.value
        };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            value: nextProps.value
        });
    }
    handleOnChange() {
        this.setState({
            value: this.refs.inputElement.value
        });
    }
    getValue(){
        return this.state.value;
    }
    focus(){
        ReactDOM.findDOMNode(this.refs.inputElement).focus();
    }
    validate(value){
        const {validateFunc} = this.props;
        if(validateFunc){
            return validateFunc(value) ? 'has-success' : 'has-error';
        }
    }
    render() {
        const {value} = this.state;
        return (
            <div className={'form-group ' + this.validate(value)}>
                <input
                    style={this.props.style}
                    type={this.props.type}
                    ref="inputElement"
                    className="form-control"
                    value={ value }
                    list={this.props.list}
                    autoComplete={this.props.autoComplete}
                    placeholder={this.props.placeholder}
                    onChange={ this.handleOnChange }/>
            </div>
        );
    }
}
InputTextStateful.defaultProps = {
    value: '',
    validateFunc: undefined,
    type: 'text'
};
InputTextStateful.propTypes = {
    value: PropTypes.any,
    validateFunc: PropTypes.func,
    type: PropTypes.string,
    list: PropTypes.string,
    autoComplete: PropTypes.string,
    placeholder: PropTypes.string
};

export default InputTextStateful;
