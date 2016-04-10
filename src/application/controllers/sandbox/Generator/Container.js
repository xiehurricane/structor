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

import { ButtonGroup, Button } from 'react-bootstrap';

import GeneratorList from '../GeneratorList';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){

        const { componentModel: {stage}, hide } = this.props;

        const toolbarLabelStyle = {
            margin: '0 1em'
        };
        const labelSectionStyle = {
            width: '35%',
            margin: '0, 2em'
        };
        const centerSectionStyle = {
            width: '30%',
            display: 'flex',
            justifyContent: 'center'
        };
        const toolbarSectionStyle = {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1em'
        };

        const closeButton = (
            <Button onClick={(e) => {e.stopPropagation(); e.preventDefault(); hide();} }>
                <span style={toolbarLabelStyle}>Close</span>
            </Button>
        );

        let backStepLabel = null;
        let nextStepLabel = null;
        let toolbar = null;
        let header = null;
        let content = null;
        if(stage === 'step1'){
            nextStepLabel = (
                <h5 className="text-muted text-center">Set component name</h5>
            );
            backStepLabel = (
                <h5 className="text-muted text-center">Set component name</h5>
            );
            toolbar = (
                <ButtonGroup bsSize="xs">
                    <Button><span style={toolbarLabelStyle}>Back</span></Button>
                    <Button><span style={toolbarLabelStyle}>Next</span></Button>
                    {closeButton}
                </ButtonGroup>
            );
            header = (<h4 className="text-center">Select component source code generator</h4>);
            content = (<GeneratorList />);
        }
        return (
            <div style={{position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px', overflow: 'auto'}}>
                <div style={{width: '100%', position: 'fixed', zIndex: '100', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ffffff'}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <div style={labelSectionStyle} >{backStepLabel}</div>
                        <div style={centerSectionStyle} >{header}</div>
                        <div style={labelSectionStyle} >{nextStepLabel}</div>
                    </div>
                    <div style={toolbarSectionStyle}>{toolbar}</div>
                </div>
                <div style={{marginTop: '6em', padding: '2em 2em 2em 2em' }}>
                    {content}
                </div>
            </div>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);

