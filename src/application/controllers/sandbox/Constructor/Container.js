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
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        const domNode = ReactDOM.findDOMNode(this);
        domNode.onload = ( () => {

            this.contentDocument = domNode.contentDocument;
            this.contentWindow = domNode.contentWindow;
            if(this.contentWindow.pageReadyState !== 'initialized'){

                this.contentWindow.onPageDidMount = (page) => {
                    this.page = page;

                    //page.bindOnComponentMouseDown(this.handleComponentClick);
                };

                this.contentWindow.__createMainFrame();
            }
        });
    }

    componentWillUnmount(){
        if(this.page){
            this.page = undefined;
        }
    }

    componentWillUpdate(nextProps, nextState){
    }

    render(){
        return (<iframe {...this.props} src="/structor/sandbox/incapsulated-sagas" />);
    }

}

export default connect(modelSelector, containerActions)(Container);

