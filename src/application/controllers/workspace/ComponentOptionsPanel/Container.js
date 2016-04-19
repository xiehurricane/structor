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

import {set, forOwn, isObject} from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { Panel, PanelGroup } from 'react-bootstrap';

import OptionInput from '../../../views/workspace/OptionInput.js';
import CollapsiblePlusOptionInput from '../../../views/workspace/CollapsiblePlusOptionInput.js';

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleAddNewProp = this.handleAddNewProp.bind(this);
        this.handleChangeOption = this.handleChangeOption.bind(this);
        this.handleDeleteOption = this.handleDeleteOption.bind(this);
    }

    handleAddNewProp(options){
        if(options.path && /^[a-zA-Z0-9.]+$/.test(options.path)){
            let valueObject = {};
            if(/^[0-9.]+$/.test(options.value)){
                set(valueObject, options.path, parseFloat(options.value));
            } else if(options.value === "true"){
                set(valueObject, options.path, true);
            } else if(options.value === "false"){
                set(valueObject, options.path, false);
            } else {
                set(valueObject, options.path, '' + options.value);
            }
            this.handleChangeOption(valueObject);
        }
    }

    handleChangeOption(optionObject){
        const { currentComponent, changeOption } = this.props;
        changeOption(currentComponent, optionObject);
    }

    handleDeleteOption(path){
        const { currentComponent, deleteOption } = this.props;
        deleteOption(currentComponent, path);
    }

    render() {

        const { currentComponent} = this.props;

        let style = {
            width: '100%',
            paddingTop: '5px',
            paddingRight: '5px',
            paddingLeft: '5px',
            paddingBottom: '10px',
            border: '1px solid #DBDBDB',
            borderRadius: '3px'
        };

        let panelContent = null;

        if(currentComponent){

            const {key, sourceFilePath, componentName, props, text} = currentComponent;

            let optionInputs = [];

            forOwn(props, (value, prop) => {
                if(isObject(value)){
                    forOwn(value, (subValue, subProp) => {
                        if(!isObject(subValue)){
                            let valueObject = {};
                            let pathTo = prop + '.' + subProp;
                            set(valueObject, pathTo, subValue);
                            optionInputs.push(
                                <OptionInput
                                    key={pathTo + key}
                                    style={{marginTop: '0.5em', padding: '0 1em 0 1em'}}
                                    valueObject={valueObject}
                                    path={pathTo}
                                    onDeleteValue={this.handleDeleteOption}
                                    onChangeValue={this.handleChangeOption}/>
                            );
                        }
                    });
                } else {
                    let valueObject = {};
                    let pathTo = prop;
                    set(valueObject, pathTo, value);
                    optionInputs.push(
                        <OptionInput
                            key={pathTo + key}
                            style={{marginTop: '0.5em', padding: '0 1em 0 1em'}}
                            valueObject={valueObject}
                            path={pathTo}
                            onDeleteValue={this.handleDeleteOption}
                            onChangeValue={this.handleChangeOption}/>
                    );
                }
            });

            panelContent = (
                <div style={style}>
                    <div style={{position: 'relative'}}>
                        {/*<div style={{width: '100%', overflow: 'auto'}}>
                            <p><span>Props:</span></p>
                            <pre style={{fontSize: '10px'}}>{JSON.stringify(props, null, 2)}</pre>
                        </div>*/}
                        <CollapsiblePlusOptionInput
                            style={{width: '100%', zIndex: '1030', marginBottom: '0.5em'}}
                            onCommit={this.handleAddNewProp}/>
                    </div>
                    {optionInputs}
                </div>
            );
        } else {
            panelContent = (
                <div style={style}>
                    <h4 className='text-center'>Properties are not available</h4>
                </div>
            );
        }
        return panelContent;
    }

}

export default connect(modelSelector, containerActions)(Container);
