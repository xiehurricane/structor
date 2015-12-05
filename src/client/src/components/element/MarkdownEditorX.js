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
import { Panel, Tabs, Tab } from 'react-bootstrap';
import AceEditor from './AceEditor.js';
import marked from 'marked';

class MarkdownEditorX extends Component {

    constructor(props) {

        super(props);

        this.state = {
            htmlContent: marked(this.props.markdownSource),
            key: 0
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.handleMarkdownChange = this.handleMarkdownChange.bind(this);
    }

    handleSelect(key) {
        this.setState({key: key});
    }

    handleMarkdownChange(markdownValue) {
        this.props.onMarkdownChange(markdownValue);
    }

    getMarkdownSource() {
        return this.refs.editor.getSourceCode();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.markdownSource) {
            this.setState({
                htmlContent: marked(nextProps.markdownSource)
            });
        }
    }

    render() {

        let editorStyle = {
            height: this.props.editorHeight || '500px',
            width: '100%'
        };
        let previewStyle = {
            height: this.props.previewHeight || '100%',
            overflow: 'auto'
        };

        return (
            <Tabs activeKey={this.state.key} onSelect={this.handleSelect} style={this.props.style}>
                <Tab title={ 'Preview' }
                     style={ { padding: '0.5em'} }
                     eventKey={ 0 }>
                    <Panel>
                        <div style={previewStyle} dangerouslySetInnerHTML={{__html: this.state.htmlContent}}>
                        </div>
                    </Panel>
                </Tab>
                <Tab title="Editor"
                     style={ { padding: '0.5em'} }
                     eventKey={ 1 }>
                    <AceEditor
                        ref='editor'
                        sourceName={this.props.sourceName}
                        onChangeText={this.handleMarkdownChange}
                        mode='ace/mode/markdown'
                        style={ editorStyle }
                        sourceCode={ this.props.markdownSource }/>
                    <hr/>
                    <p style={{marginTop: '1em'}}>
                        <span>A quick reference of </span>
                                <span>
                                    <a href='http://markdown-guide.readthedocs.org/en/latest/basics.html'
                                       target='blank'>
                                        Markdown Basics
                                    </a>
                                </span>
                    </p>

                    <p>
                        <span>Also supports </span>
                                <span>
                                    <a href='https://help.github.com/articles/github-flavored-markdown/'
                                       target='blank'>
                                        GFM
                                    </a>
                                </span>
                    </p>
                </Tab>
            </Tabs>
        );
    }
}


MarkdownEditorX.propTypes = {
    markdownSource: PropTypes.string.isRequired,
    onMarkdownChange: PropTypes.func.isRequired
};

export default MarkdownEditorX;

