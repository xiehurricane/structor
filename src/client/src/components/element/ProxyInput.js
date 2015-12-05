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
import { Input, Button } from 'react-bootstrap';

class ProxyInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            urlValue: this.props.urlValue
        };
        this.handleClearUrlValue = this.handleClearUrlValue.bind(this);
        this.handleChangeUrlValue = this.handleChangeUrlValue.bind(this);
    }

    getUrlValue(){
        return this.refs.inputElement.getValue();
    }
    
    handleClearUrlValue(e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            urlValue: ''
        });
    }
    
    handleChangeUrlValue(e){
        this.setState({
            urlValue: this.refs.inputElement.getValue()
        });
    }

    render() {
        return (
            <Input 
                ref="inputElement"
                value={this.state.urlValue}
                type="text"
                label={ this.props.label} 
                placeholder="Enter value"
                addonBefore="URL:"
                onChange={this.handleChangeUrlValue}
                buttonAfter={ <Button 
                                onClick={this.handleClearUrlValue}
                                bsStyle="default">
                                <span className={ 'fa fa-times'}></span>
                              </Button> 
                }>
            </Input>
        );
    }

}

export default ProxyInput;
