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

import {forOwn} from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import marked from 'marked';
import { ListGroup, ListGroupItem, Tabs, Tab } from 'react-bootstrap';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { AceEditor } from '../../../views';

const depsHelp = marked(`
##### Specified file will be included as a global include for all components in Structor. File must be placed into app/assets directory. Allowed file types: JS, CSS.
##### NPM packages which are imported in this file along with discovered packages will be automatically installed as dependency packages during component installation from Structor Market. 

##### Example: file used for all Material UI components:

\`\`\`
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
\`\`\`

`);


class Container extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeReadmeTabKey: 1,
            activeTopTabKey: 1
        };
        this.handleChangeTemplateText = this.handleChangeTemplateText.bind(this);
        this.handleReadmeTabSelect = this.handleReadmeTabSelect.bind(this);
        this.handleTopTabSelect = this.handleTopTabSelect.bind(this);
        this.handleOnChangeScreenshotInput = this.handleOnChangeScreenshotInput.bind(this);
        this.handlePublish = this.handlePublish.bind(this);
    }

    componentDidMount(){
        $(this.refs.sourceCodePane).children('pre').each((i, block) => {
            hljs.highlightBlock(block);
        });
    }

    componentDidUpdate(){
        $(this.refs.sourceCodePane).children('pre').each((i, block) => {
            hljs.highlightBlock(block);
        });
    }

    handleChangeTemplateText(e){
        e.stopPropagation();
        e.preventDefault();
        const {changeActiveTemplateText} = this.props;
        const nextTemplate = e.currentTarget.dataset.tmpl;
        changeActiveTemplateText(nextTemplate);
    }

    handleReadmeTabSelect(key){
        this.setState({
            activeReadmeTabKey: key
        });
        this.props.changeReadmeText(this.refs.readmeEditor.getSourceCode());
    }

    handleTopTabSelect(key){
        this.setState({
            activeTopTabKey: key
        });
    }

    handlePublish(e){
        e.stopPropagation();
        e.preventDefault();
        const {publishGenerator} = this.props;
        const options = {
            generatorKey: this.refs.generatorKeyInput.value,
            readme: this.refs.readmeEditor.getSourceCode(),
            globalImport: this.refs.globalImportInput.value
        };
        publishGenerator(options);
    }

    handleOnChangeScreenshotInput(e){
        const formData = new FormData(this.refs.uploadForm);
        this.props.uploadScreenshot(formData);
    }

    render(){
        const { componentModel: {templateObject, activeTemplate, screenshotUrlCounter} } = this.props;
        const {fileObjects, readme, dependencies, componentGroup, componentName} = templateObject;
        const cellBoxStyle = {
            display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'
        };
        const readmePreview = marked(readme);

        let templateText;
        let templatePath;
        let templateItemsList = [];
        let active;
        let key;
        fileObjects.forEach((fileObject, index) => {
            key = fileObject.filePath;
            active = key === activeTemplate;
            templateItemsList.push(
                <ListGroupItem
                    href="#"
                    key={key}
                    style={{position: 'relative'}}
                    active={active}
                    data-tmpl={key}
                    onClick={this.handleChangeTemplateText}>
                    {fileObject.nestedDir && <span>{fileObject.nestedDir + '/'}</span>}
                    <span>{fileObject.fileName}</span>
                    { active ? null :
                        <span className="badge" style={{backgroundColor: '#fff', color: '#555'}}>
                            <span className="fa fa-chevron-right" />
                        </span>
                    }
                </ListGroupItem>
            );
            if(active){
                templateText = fileObject.sourceCode;
                templatePath = fileObject.filePath;
            }
        });

        return (
            <Tabs
                id="mainContainer"
                aria-labelledby="mainContainer"
                activeKey={this.state.activeTopTabKey}
                animation={false}
                onSelect={this.handleTopTabSelect}>
                <Tab
                    key={'readme'}
                    eventKey={1}
                    title="Component">
                    <Grid
                        fluid={ true }
                        style={{marginTop: '1em'}}>
                        <Row style={ { position: 'relative'} }>
                            <Col
                                xs={ 12 }
                                md={ 6 }
                                sm={ 6 }
                                lg={ 6 }>
                                <label>Generator key</label>
                                <input
                                    defaultValue={componentGroup + '.' + componentName}
                                    ref="generatorKeyInput"
                                    type="text"
                                    className="form-control"
                                    placeholder="Group[.Group].Name"
                                />
                                <small>Only numeric and characters from US-ASCII alphabet are accepted. Example: Group.ComponentName</small>
                                <div style={cellBoxStyle}>
                                    <Button
                                        bsStyle="primary"
                                        onClick={this.handlePublish}>
                                        Publish
                                    </Button>
                                </div>
                                <form
                                    ref="uploadForm"
                                    method="POST"
                                    encType="multipart/form-data"
                                    style={{width: '100%'}}>
                                    <label>Screenshot</label>
                                    <input
                                        type="file"
                                        name="screenshot"
                                        accept="image/png"
                                        onChange={this.handleOnChangeScreenshotInput}
                                        style={{width: '100%'}}/>
                                </form>
                                <div style={cellBoxStyle}>
                                    <div style={{width: '300px', marginTop: '2em'}}>
                                        <img
                                            src={"/structor-sandbox-preview/screenshot.png?" + screenshotUrlCounter}
                                            style={{width: "100%"}} />
                                    </div>
                                </div>
                            </Col>
                            <Col
                                xs={ 12 }
                                md={ 6 }
                                sm={ 6 }
                                lg={ 6 }>
                                <div style={cellBoxStyle}>
                                    <div style={{width: '100%', height: '100%'}}>
                                        <label>Readme:</label>
                                        <Tabs
                                            id="childContainer"
                                            aria-labelledby="childContainer"
                                            activeKey={this.state.activeReadmeTabKey}
                                            animation={false}
                                            onSelect={this.handleReadmeTabSelect}>
                                            <Tab
                                                key="editor"
                                                eventKey={1}
                                                title="Readme markdown">
                                                <AceEditor
                                                    id="readmeEditor"
                                                    ref="readmeEditor"
                                                    mode="ace/mode/markdown"
                                                    sourceName="readme"
                                                    style={{
                                                        width: '100%',
                                                        marginTop: '1em',
                                                        height: '42.5em',
                                                        borderRadius: '3px',
                                                        border: '1px solid #cdcdcd'
                                                    }}
                                                    sourceCode={readme}/>
                                            </Tab>
                                            <Tab
                                                key="preview"
                                                eventKey={2}
                                                title="Preview">
                                                <div dangerouslySetInnerHTML={{__html: readmePreview}}></div>
                                            </Tab>
                                        </Tabs>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Tab>
                <Tab
                    key={'fileList'}
                    eventKey={2}
                    title="Source code">
                    <Grid
                        fluid={ true }
                        style={{marginTop: '1em'}}>
                        <Row style={{position: 'relative'}}>
                            <Col
                                xs={ 12 }
                                md={ 4 }
                                sm={ 4 }
                                lg={ 4 }>
                                <div style={cellBoxStyle}>
                                    <div style={{width: '100%', paddingTop: '2em'}}>
                                        <small>List of files</small>
                                        <ListGroup>
                                            {templateItemsList}
                                        </ListGroup>
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
                                        <small>{templatePath}</small>
                                        <div ref="sourceCodePane">
                                        <pre key={templatePath}><code>
                                            {templateText}
                                        </code></pre>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Tab>
                <Tab
                    key={'dependencies'}
                    eventKey={3}
                    title="Dependencies">
                    <Grid
                        fluid={ true }
                        style={{marginTop: '1em'}}>
                        <Row style={ { position: 'relative'} }>
                            <Col
                                xs={ 12 }
                                md={ 6 }
                                sm={ 6 }
                                lg={ 6 }>
                                <div style={cellBoxStyle}>
                                    <div style={{width: '100%', paddingTop: '2em'}}>
                                        <label htmlFor="globalImportInput">Global import file</label>
                                        <input
                                            id="globalImportInput"
                                            ref="globalImportInput"
                                            type="text"
                                            className="form-control"
                                            placeholder="File name in app/assets dir"
                                        />
                                        <div dangerouslySetInnerHTML={{__html: depsHelp }}></div>
                                    </div>
                                </div>
                            </Col>
                            <Col
                                xs={ 12 }
                                md={ 6 }
                                sm={ 6 }
                                lg={ 6 }>
                                <div style={cellBoxStyle}>
                                    <div style={{width: '100%', height: '100%', paddingTop: '2em'}}>
                                        <label>Discovered NPM packages in the source code:</label>
                                        <div ref="sourceDependenciesPane">
                                        <pre><code>
                                            {JSON.stringify(dependencies, null, 4)}
                                        </code></pre>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Tab>
            </Tabs>
        );
    }
}


export default connect(modelSelector, containerActions)(Container);

