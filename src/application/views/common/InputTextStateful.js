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
            value: this.refs.inputElement.getValue()
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
            return validateFunc(value) ? 'success' : 'error';
        }
    }
    render() {
        const {value} = this.state;
        const {validateFunc} = this.props;
        return (
            <Input
                {...this.props}
                bsStyle={this.validate(value)}
                ref="inputElement"
                hasFeedback={!!validateFunc}
                value={ value }
                onChange={ this.handleOnChange }/>
        );
    }
}
InputTextStateful.defaultProps = {
    value: '',
    validateFunc: undefined
};
InputTextStateful.propTypes = {
    value: PropTypes.any,
    validateFunc: PropTypes.func
};

export default InputTextStateful;
