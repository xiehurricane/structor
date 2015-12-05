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

class ContentEditable extends Component {

    constructor(props) {
        super(props);
        this.emitChange = this.emitChange.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    }

    emitChange(){

        var html = this.refs.editableElement.innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;

    }

    handleOnBlur(){

        if(this.props.onBlur){
            this.props.onBlur({
                target: {
                    value: this.lastHtml
                }
            })
        }

    }

    handleOnKeyDown(e){

        if(e.keyCode == 13 || e.keyCode == 27){
            this.handleOnBlur();
        }

    }

    shouldComponentUpdate(nextProps){
        return nextProps.html !== this.refs.editableElement.innerHTML;
    }

    componentDidUpdate() {
        var node = this.refs.editableElement;
        if ( this.props.html !== node.innerHTML ) {
            node.innerHTML = this.props.html;
        }
    }

    componentDidMount(){
        $(this.refs.editableElement).focus();
    }

    render(){
        return (
            <span
                ref="editableElement"
                className='umy-grid-text-editable'
                style={{
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                }}
                onInput={this.emitChange}
                onBlur={this.handleOnBlur}
                onKeyDown={this.handleOnKeyDown}
                contentEditable
                dangerouslySetInnerHTML={{__html: this.props.html}}>
            </span>
        );
    }

}

export default ContentEditable;

