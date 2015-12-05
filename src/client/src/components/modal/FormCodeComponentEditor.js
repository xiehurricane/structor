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

import validator from 'validator';

import {
    Grid, Row, Col
} from 'react-bootstrap';

import AceEditor from '../element/AceEditor.js';

class FormCodeComponentEditor extends Component {

    getComponentScript() {
        if (this.refs.editor) {
            return this.refs.editor.getSourceCode();
        } else {
            return null;
        }
    }

    render() {

        var editorElement = null;
        var toolBarElement = null;

        if (this.props.sourceCode) {
            toolBarElement = (
                <Row style={{marginBottom: '3px'}}>
                    <Col xs={12}>
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <div className="dropdown">
                                        <button className="btn btn-default btn-xs dropdown-toggle" type="button"
                                                id="dropdownMenu" data-toggle="dropdown" aria-expanded="true">
                                            <span className="fa fa-gear fa-fw"></span>
                                            <span className="fa fa-caret-down fa-fw"></span>
                                        </button>
                                        <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
                                            <li role="presentation">
                                                {/*<a role="menuitem" href="#"
                                                   onClick={this._handleCreateComponentChildren}>
                                                    Merge children into source code
                                                </a>*/}
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                                <td style={{verticalAlign: 'middle'}}>
                                    <p style={{marginLeft: '1em', marginBottom: '0', marginTop: '0'}}>
                                        <span>{this.props.sourceFilePath}</span>
                                    </p>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            );
            editorElement = (
                <AceEditor ref='editor'
                           sourceName='componentSource'
                           mode='ace/mode/jsx'
                           style={this.props.editorStyle}
                           sourceCode={this.props.sourceCode}/>
            );
        }
        return (
            <Grid style={this.props.style} fluent={true}>
                {toolBarElement}
                <Row>
                    <Col xs={12}>
                        {editorElement}
                    </Col>
                </Row>
            </Grid>
        );
    }

}

export default FormCodeComponentEditor;
