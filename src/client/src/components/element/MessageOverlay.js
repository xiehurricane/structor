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
import { removeMessage as removeServerMessage } from '../../actions/serverActions.js';

class MessageOverlay extends Component {

    constructor(props) {
        super(props);
        this.handleServerMessageClick = this.handleServerMessageClick.bind(this);
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

    handleServerMessageClick(e){
        let index = e.currentTarget.attributes['data-message-index'].value;
        this.props.removeServerMessage(index);
    }

    render() {
        const { serverMessages } = this.props;
        if (serverMessages.length > 0) {
            const style = {
                position: 'relative',
                color: '#ffffff',
                borderRadius: '.3em',
                verticalAlign: 'middle',
                textAlign: 'left',
                padding: '1.7em',
                fontSize: '12px'
            };
            const buttonStyle = {
                position: 'absolute',
                top: '0',
                right: '0',
                width: '1em',
                height: '1em',
                color: '#fff',
                borderRadius: '50%',
                verticalAlign: 'middle',
                textAlign: 'center',
                cursor: 'pointer',
                fontSize: '18px'
            };

            let messages = [];
            serverMessages.forEach( (item, index) => {
                let messageStyle = Object.assign({}, style);
                if(item.isError === true){
                    messageStyle.backgroundColor = '#C90008';
                } else {
                    messageStyle.backgroundColor = '#5cb85c';
                }
                messages.push(
                    <p key={'sm' + index} style={messageStyle} >
                        <span>{item.text}</span>
                        <span
                            style={buttonStyle}
                            className="fa fa-times"
                            data-message-index={index} onClick={this.handleServerMessageClick}></span>
                    </p>
                )
            });

            this._overlay = (
                <div
                    style={{position: 'absolute', width: '30em', padding: '0.5em', right: '0', top: '0', zIndex: '9999'}}>
                    <div style={{position: 'relative', width: '100%', height: '100%'}}>
                        {messages}
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

function mapStateToProps(state) {
    const { server } = state;
    return {
        serverMessages: server.messages,
        serverMessagesCounter: server.messagesCounter
    };
}

export default connect(mapStateToProps, { removeServerMessage })(MessageOverlay);
