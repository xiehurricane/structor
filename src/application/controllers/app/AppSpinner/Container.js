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
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { getAll } from './selectors.js';
import * as actions from './actions.js';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._mountNode = document.createElement('div');
        this._mountNode.style['z-index'] = '9999';
        document.body.appendChild(this._mountNode);
        ReactDOM.render(this._overlay, this._mountNode);
    }

    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this._mountNode);
        this._mountNode = null;
    }

    componentDidUpdate() {
        if (this._mountNode) {
            ReactDOM.render(this._overlay, this._mountNode);
        }
    }

    render() {
        const { model: { tasks } } = this.props;
        const tasksCount = tasks.size;
        if (tasksCount > 0) {

            let tasksList = [];
            tasks.forEach((value, key) => {
                tasksList.push(
                    <p key={key}>{'[' + key + '] stage: ' + value.stage + ', count: ' + value.counter}</p>
                );
            });
            const style = {
                position: 'absolute',
                top: '40%',
                left: '50%',
                width: '4em',
                height: '4em',
                margin: '-2em 0 0 -2em',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: '#ffffff',
                borderRadius: '.3em',
                verticalAlign: 'middle',
                textAlign: 'center',
                padding: '0.7em'
            };
            this._overlay = (
                <div style={{position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', zIndex: '9999'}}>
                    <div style={{position: 'relative', width: '100%', height: '100%'}}>
                        <div style={{padding: '2em'}}>
                            {tasksList}
                        </div>
                        <div style={style}>
                            <span style={{fontSize: '30px'}} className='fa fa-cog fa-spin'></span>
                        </div>
                    </div>
                </div>
            );
        } else {
            this._overlay = (
                <span></span>
            );
        }
        return (
            <span></span>
        );
    }

}

export default connect(
    createStructuredSelector({
        model: getAll
    }),
    dispatch => bindActionCreators(actions, dispatch)
)(Container)
