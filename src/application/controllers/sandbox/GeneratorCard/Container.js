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
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { Grid, Row, Col, Panel, Button, Input } from 'react-bootstrap';
import marked from 'marked';

class Container extends Component {

    constructor(props) {
        super(props);
        this.handlePublishSample = this.handlePublishSample.bind(this);
        this.handleOnChangeScreenshotInput = this.handleOnChangeScreenshotInput.bind(this);
    }

    handlePublishSample(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.publishGeneratorSample(this.refs.generatorKeyInput.getValue());
    }

    handleOnChangeScreenshotInput(e){
        const formData = new FormData(this.refs.uploadForm);
        this.props.uploadScreenshot(formData);
    }


    render(){
        const { componentModel: {screenshotUrlCounter}, sandboxModel:{generatorSampleKey}, generatorTemplateModel:{templateObject: {readme}} } = this.props;
        const cellBoxStyle = {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginTop: '1em'
        };

        return (
            <div style={{marginTop: '3em'}}>
                <div style={cellBoxStyle}>
                    <Input defaultValue={generatorSampleKey}
                           ref="generatorKeyInput"
                           type="text"
                           placeholder="Top.Group[.Group].Name"
                           label="Generator key"
                           help="Only numeric and characters from US-ASCII alphabet are accepted. Example: Top.Group.Name" />
                </div>
                <div style={cellBoxStyle}>
                    <Button bsStyle="primary" onClick={this.handlePublishSample}>Submit publishing</Button>
                </div>
                <div style={cellBoxStyle}>
                    <Panel style={{width: '70%', minWidth: '400px'}}>
                        <Grid fluid={ true }>
                            <Row>
                                <Col
                                    xs={ 12 }
                                    md={ 4 }
                                    sm={ 4 }
                                    lg={ 4 }>
                                    <div>
                                        <img
                                            src={"/sandbox-preview/assets/img/screenshot.png?" + screenshotUrlCounter}
                                            style={{width: "100%"}} />
                                    </div>
                                    <form ref="uploadForm"
                                          method="POST"
                                          enctype="multipart/form-data">
                                        <input type="file"
                                               name="screenshot"
                                               accept="image/png"
                                               onChange={this.handleOnChangeScreenshotInput} style={{width: '100%'}} />
                                    </form>

                                </Col>
                                <Col
                                    xs={ 12 }
                                    md={ 8 }
                                    sm={ 8 }
                                    lg={ 8 }>
                                    <div>
                                        <div dangerouslySetInnerHTML={{__html: marked(readme)}}></div>
                                    </div>
                                    {/*<p style={{ marginTop: '2em'}}>
                                     <a target="__blank" href={window.serviceUrl + '/generator?key=' + generatorKey + '&repo=' + projectRepo}>
                                     <i className="fa fa-external-link"></i>
                                     <span style={{marginLeft: '0.5em'}}>Read more...</span>
                                     </a>
                                     </p>*/}
                                </Col>
                            </Row>
                        </Grid>
                    </Panel>
                </div>
            </div>
        );
    }
}


export default connect(modelSelector, containerActions)(Container);

