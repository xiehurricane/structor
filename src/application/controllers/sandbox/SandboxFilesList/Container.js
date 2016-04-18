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

import {isEmpty} from 'lodash';
import validator from 'validator';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { Grid, Row, Col, Button, ListGroup, ListGroupItem, Tabs, Tab  } from 'react-bootstrap';

class Container extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeFile: undefined
        };
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleChangePreview = this.handleChangePreview.bind(this);
    }

    componentDidMount(){
        $(this.refs.sourceCodePane).children('pre').each((i, block) => {
            hljs.highlightBlock(block);
        });
        const contentWindow = this.refs.livePreviewFrame.contentWindow;
        contentWindow.onPageDidMount = () => {
            console.log('Live preview page was mounted');
            this.props.setAvailableToPublish(true);
            this.props.success('Test component source code has been compiled successfully. Look at the live preview.');
        };
        //this.refs.livePreviewFrame.onload = (() => {
        //});
    }

    componentDidUpdate(){
        $(this.refs.sourceCodePane).children('pre').each((i, block) => {
            hljs.highlightBlock(block);
        });
    }

    handleOnSubmit(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.showGeneratorCard();
    }

    handleChangePreview(e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            activeFile: e.currentTarget.dataset.filename
        });
    }

    render() {

        const { componentModel: {generatedData, isAvailableToPublish} } = this.props;
        let { activeFile } = this.state;
        const {files, dependencies} = generatedData;

        const cellBoxStyle = {
            display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'
        };

        let previewSourceCode;
        let previewFilePath;

        let fileItemsList = [];
        if (files && files.length > 0) {
            activeFile = activeFile || files[0].outputFilePath;
            let active;
            files.forEach((file, index) => {
                active = file.outputFilePath === activeFile;
                fileItemsList.push(
                    <ListGroupItem href="#"
                                   key={file.outputFileName + index}
                                   style={{position: 'relative'}}
                                   active={active}
                                   data-filename={file.outputFilePath}
                                   onClick={this.handleChangePreview}>
                        <span>{file.outputFileName}</span>
                        { active ? null :
                            <span className="badge" style={{backgroundColor: '#fff', color: '#555'}}>
                            <span className="fa fa-chevron-right"></span>
                        </span>
                        }
                    </ListGroupItem>
                );
                if(active){
                    previewSourceCode = file.sourceCode;
                    previewFilePath = file.outputFilePath;
                }
            });
        }
        let dependenciesItem;
        if(dependencies && !isEmpty(dependencies)){
            dependenciesItem = (
                <ListGroupItem href="#"
                               key={'dependencies'}
                               style={{position: 'relative'}}
                               active={'dependencies' === activeFile}
                               data-filename={'dependencies'}
                               onClick={this.handleChangePreview}>
                    <span>Dependencies</span>
                    { 'dependencies' === activeFile ? null :
                        <span className="badge" style={{backgroundColor: '#fff', color: '#555'}}>
                            <span className="fa fa-chevron-right"></span>
                        </span>
                    }
                </ListGroupItem>
            );
            if('dependencies' === activeFile){
                previewSourceCode = JSON.stringify(dependencies || {}, null, 4);
                previewFilePath = 'None';
            }
        }
        let iframeStyle = {
            height : '42.5em',
            width : '100%',
            minWidth : '320px',
            border : '1px solid #000000'
        };
        return (
            <Tabs defaultActiveKey={1} animation={false}>
                <Tab key={'fileList'} eventKey={1} title="Source code files">
                    <Grid fluid={ true } style={{marginTop: '1em'}}>
                        <Row style={ { position: 'relative'} }>
                            <Col
                                xs={ 12 }
                                md={ 12 }
                                sm={ 12 }
                                lg={ 12 }>
                                <h5><small>Output file path:&nbsp;&nbsp;</small>{previewFilePath}</h5>
                            </Col>
                        </Row>
                        <Row style={ { position: 'relative'} }>
                            <Col
                                xs={ 12 }
                                md={ 4 }
                                sm={ 4 }
                                lg={ 4 }>

                                <div style={cellBoxStyle}>
                                    <div style={{width: '100%', paddingTop: '2em'}}>
                                        <small>List of generated files</small>
                                        <ListGroup>
                                            {fileItemsList}
                                        </ListGroup>
                                        { dependenciesItem ? <div style={{marginTop: '1em'}}>
                                            <small>npm &amp; resources dependencies</small>
                                            <ListGroup>
                                                {dependenciesItem}
                                            </ListGroup>
                                        </div> : null }
                                        <div style={{marginTop: '2em', display: 'flex', justifyContent: 'center'}}>
                                            <Button bsStyle="primary"
                                                    disabled={!isAvailableToPublish}
                                                    onClick={this.handleOnSubmit}>Publish generator</Button>
                                        </div>
                                        { isAvailableToPublish ? null :
                                            <h5 className="text-danger">
                                                <p>There were runtime errors during the rendering of the live preview.</p>
                                                <p>Look at the console output to find the issue.</p>
                                            </h5>
                                        }
                                    </div>
                                </div>

                            </Col>
                            <Col
                                xs={ 12 }
                                md={ 8 }
                                sm={ 8 }
                                lg={ 8 }>

                                <div style={cellBoxStyle}>
                                    <div style={{width: '100%', height: '100%', paddingTop: '2em'}}>
                                        <small>Source code preview</small>
                                        <div ref="sourceCodePane">
                                        <pre key={previewFilePath}><code>
                                            {previewSourceCode}
                                        </code></pre>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Tab>
                <Tab key={'livePreview'} eventKey={2} title="Live component preview">
                    <iframe ref="livePreviewFrame" style={iframeStyle} frameBorder="0" src="/structor-sandbox-preview/index.html" />
                </Tab>
            </Tabs>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);

