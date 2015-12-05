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
import marked from 'marked';

import {
    Button, Tabs, Tab
} from 'react-bootstrap';
import AceEditor from '../element/AceEditor.js';

class FormGeneratorMetaInfo extends Component {

    constructor(props) {
        super(props);
        this.handleBackStep = this.handleBackStep.bind(this);
        this.handleSubmitStep = this.handleSubmitStep.bind(this);
    }

    handleBackStep(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onBackStep) {
            this.props.onBackStep();
        }
    }

    handleSubmitStep(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onSubmitStep) {
            this.props.onSubmitStep({
                metaModel: this.refs.editor.getSourceCode()
            });
        }
    }

    render() {

        const { metaModel, metaHelp } = this.props;

        return (
            <div style={this.props.formStyle}>
                <Tabs defaultActiveKey={1}>
                    <Tab key={'component'} eventKey={1} title='Meta info'>
                        <AceEditor ref='editor'
                                   sourceName='componentSource'
                                   mode='ace/mode/javascript'
                                   style={{height: '400px', width: '100%'}}
                                   sourceCode={metaModel}/>
                    </Tab>
                    <Tab key={'readMe'} eventKey={2} title='Meta info help'>
                        <div style={{height: '400px', marginTop: '1em', width: '100%', overflow: 'auto'}}>
                            <div style={{width: '100%', padding: '0 2em 0 2em'}}>
                                <div dangerouslySetInnerHTML={{__html: marked(metaHelp)}} >
                                </div>
                            </div>
                        </div>
                    </Tab>

                </Tabs>
                <div style={{display: 'table', textAlign: 'center', width: '100%', marginTop: '2em'}}>
                    <Button bsStyle='default' onClick={this.handleBackStep}>Back</Button>
                    <Button bsStyle='primary' onClick={this.handleSubmitStep}>Next</Button>
                </div>
            </div>
        );
    }

}

export default FormGeneratorMetaInfo;
