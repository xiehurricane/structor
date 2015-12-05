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
    Button
} from 'react-bootstrap';

import AceEditor from '../element/AceEditor.js';

class FormGeneratedSourceCode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: 'component'
        };
        this.handleModuleSelect = this.handleModuleSelect.bind(this);
        this.handleBackStep = this.handleBackStep.bind(this);
        this.handleSubmitStep = this.handleSubmitStep.bind(this);
    }

    handleBackStep(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onBackStep) {
            this.props.onBackStep(this.getOptions());
        }
    }

    handleSubmitStep(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onSubmitStep) {
            this.props.onSubmitStep(this.getOptions());
        }
    }

    handleModuleSelect(e){
        e.preventDefault();
        e.stopPropagation();
        var module = e.currentTarget.attributes['data-module-key'].value;
        this.setState({
            selected: module
        });
    }

    getOptions() {
        return {
            sourceCode: this.refs.editor.getSourceCode()
        }
    }

    trimComponentName(label){
        if(label.length > 20){
            label = label.substr(0, 20) + '...';
        }
        return label;
    }

    render() {

        let { componentSourceDataObject: { component, modules } }= this.props;

        let sourceCode = null;
        let filePath = null;
        if(this.state.selected === 'component'){
            sourceCode = component.sourceCode;
            filePath = component.outputFilePath;
        } else {
            let selectedModule = modules[this.state.selected];
            sourceCode = selectedModule.sourceCode || '// Empty';
            filePath = selectedModule.outputFilePath;
        }

        let itemList = [];
        itemList.push(

            <a className="list-group-item"
               href="#"
               key={'component'}
               style={{position: 'relative'}}
               data-module-key={'component'}
               onClick={this.handleModuleSelect}>
                <span>{this.trimComponentName(component.componentName)}</span>
            </a>

        );
        _.forOwn( modules, (module, name) => {
            itemList.push(
                <a className="list-group-item"
                   href="#"
                   key={name}
                   style={{position: 'relative'}}
                   data-module-key={name}
                   onClick={this.handleModuleSelect}>
                    <span>{this.trimComponentName(module.name)}</span>
                </a>
            );
        });

        return (
            <div style={this.props.formStyle}>
                <table style={{width: '100%'}}>
                    <tbody>
                    <tr>
                        <td><p className='text-center'>Modules</p></td>
                        <td><p>{filePath}</p></td>
                    </tr>
                    <tr>
                        <td>
                            <div style={{padding: '0.5em', width: '100%', height: '400px', overflow: 'auto' }}>
                                <div className="list-group">
                                    {itemList}
                                </div>
                            </div>
                        </td>
                        <td style={{width: '90%'}}>
                            <AceEditor
                                ref='editor'
                                sourceName={this.state.selected}
                                mode='ace/mode/jsx'
                                isReadOnly={true}
                                style={{ height: '400px', width: '100%'}}
                                sourceCode={sourceCode}/>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <div style={{display: 'table', textAlign: 'center', width: '100%', marginTop: '2em'}}>
                    <Button bsStyle='default' onClick={this.handleBackStep}>Back</Button>
                    <Button bsStyle='primary' onClick={this.handleSubmitStep}>Save</Button>
                </div>
            </div>
        );
    }

}

export default FormGeneratedSourceCode;
