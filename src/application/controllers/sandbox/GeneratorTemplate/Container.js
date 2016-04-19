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

const templateHelp = marked(`
##### Variables which can be used in templates

\`componentName\` - component name entered by user

   Example: \` <%= componentName %> \`

\`groupName\` - group name entered by user

   Example: \` <%= groupName %> \`

\`metadata\` - metadata object

   Example: \` <%= metadata.someObjectField %> \`

\`model\` - a model tree of components which was selected for generator. Find sample structure in Sample model tab here.

\`imports\` - an array of imports of components in model tree

`);

const depsHelp = marked(`
##### Describe npm packages which should be installed into project

* \`packages\` - list of npm packages where \`name\` is a name of package and \`version\` is an exact version if needed (can be empty).
* \`copy\` - array of resources which will be copied from package directory after installation.
* \`from\` - file or folder path which is relative to package source directory in ***node_modules***
* \`to\` - file or folder path to which resources will be copied, path is cosidered as relative to \`{assetsDirPath}\`
* \`isImport\` - tells Structor to include resource into \`{assetsIndexFilePath}\`

**Note**: find ***assetsDirPath*** and ***assetsIndexFilePath*** in project config file in .structor folder
`);

const depsExample =
`{
  "packages":[
    {
      "name": "react-widgets",
      "version": "",
      "copy": [
        {
          "from": "dist/fonts",
          "to": "react-widgets/fonts"
        },
        {
          "from": "dist/css/react-widgets.css",
          "to": "react-widgets/css/react-widgets.css",
          "isImport": true
        }
      ]
    },
    {
      "name": "moment",
    }
  ]
}`;

class Container extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeMetahelpTabKey: 1,
            activeReadmeTabKey: 1,
            activeTopTabKey: 1
        };
        this.handleChangeTemplateText = this.handleChangeTemplateText.bind(this);
        this.handleMetahelpTabSelect = this.handleMetahelpTabSelect.bind(this);
        this.handleReadmeTabSelect = this.handleReadmeTabSelect.bind(this);
        this.handleTopTabSelect = this.handleTopTabSelect.bind(this);
        this.handleSaveAndGenerateSandboxComponent = this.handleSaveAndGenerateSandboxComponent.bind(this);
    }

    componentDidMount(){
        hljs.highlightBlock(this.refs.sampleModelCode);
    }

    //componentDidUpdate(){
    //    $(this.refs.sourceCodePane).children('pre').each((i, block) => {
    //        hljs.highlightBlock(block);
    //    });
    //}

    handleChangeTemplateText(e){
        e.stopPropagation();
        e.preventDefault();
        const {changeActiveTemplateText, componentModel: {activeTemplate}} = this.props;
        const nextTemplate = e.currentTarget.dataset.tmpl;
        changeActiveTemplateText(nextTemplate, activeTemplate, this.refs.templateTextEditor.getSourceCode());
    }

    handleMetahelpTabSelect(key){
        this.setState({
            activeMetahelpTabKey: key
        });
        this.props.changeMetahelpText(this.refs.metahelpEditor.getSourceCode());
        this.props.changeMetadata(this.refs.metadataEditor.getSourceCode());
    }

    handleReadmeTabSelect(key){
        this.setState({
            activeReadmeTabKey: key
        });
        this.props.changeReadmeText(this.refs.readmeEditor.getSourceCode());
    }

    handleTopTabSelect(key){
        const {changeActiveTemplateText, componentModel: {activeTemplate}} = this.props;
        changeActiveTemplateText(activeTemplate, activeTemplate, this.refs.templateTextEditor.getSourceCode());
        this.props.changeMetadata(this.refs.metadataEditor.getSourceCode());
        this.props.changeDependencies(this.refs.dependenciesEditor.getSourceCode());
        this.setState({
            activeTopTabKey: key
        });
    }

    handleSaveAndGenerateSandboxComponent(e){
        e.stopPropagation();
        e.preventDefault();
        const {saveAndGenerate} = this.props;
        const options = {
            activeTemplateText: this.refs.templateTextEditor.getSourceCode(),
            metadataSource: this.refs.metadataEditor.getSourceCode(),
            dependenciesSource: this.refs.dependenciesEditor.getSourceCode(),
            metahelp: this.refs.metahelpEditor.getSourceCode(),
            readme: this.refs.readmeEditor.getSourceCode()

        };
        saveAndGenerate(options);
    }

    render(){
        const { componentModel: {templateObject, activeTemplate} } = this.props;
        const {templates, dependencies, metadata, metahelp, readme, model} = templateObject;
        const cellBoxStyle = {
            display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'
        };
        const metahelpPreview = marked(metahelp);
        const readmePreview = marked(readme);

        let templateText;
        let templateItemsList = [];
        let active;
        forOwn(templates, (text, tmpl) => {
            active = tmpl === activeTemplate;
            templateItemsList.push(
                <ListGroupItem href="#"
                               key={tmpl}
                               style={{position: 'relative'}}
                               active={active}
                               data-tmpl={tmpl}
                               onClick={this.handleChangeTemplateText}>
                    <span>{tmpl}</span>
                    { active ? null :
                        <span className="badge" style={{backgroundColor: '#fff', color: '#555'}}>
                            <span className="fa fa-chevron-right"></span>
                        </span>
                    }
                </ListGroupItem>
            );
            if(active){
                templateText = text;
            }
        });

        return (
            <Tabs activeKey={this.state.activeTopTabKey} animation={false} onSelect={this.handleTopTabSelect}>
                <Tab key={'fileList'} eventKey={1} title="Source code templates">
                    <Grid fluid={ true } style={{marginTop: '1em'}}>
                        <Row style={ { position: 'relative'} }>
                            <Col
                                xs={ 12 }
                                md={ 4 }
                                sm={ 4 }
                                lg={ 4 }>
                                <div style={cellBoxStyle}>
                                    <div style={{width: '100%', paddingTop: '2em'}}>
                                        <small>List of templates</small>
                                        <ListGroup>
                                            {templateItemsList}
                                        </ListGroup>
                                        <div style={{marginTop: '2em', display: 'flex', justifyContent: 'center'}}>
                                            <Button bsStyle="primary"
                                                    onClick={this.handleSaveAndGenerateSandboxComponent}>Save &amp; Generate preview</Button>
                                        </div>
                                    </div>
                                </div>
                                <div style={cellBoxStyle}>
                                    <div style={{width: '100%', padding: '2em 1em 1em 1em'}}>
                                        <div dangerouslySetInnerHTML={{__html: templateHelp }}></div>
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
                                        <small>Edit template text</small>
                                        <AceEditor id="templateTextEditor"
                                                   ref="templateTextEditor"
                                                   mode="ace/mode/text"
                                                   sourceName={activeTemplate}
                                                   style={{width: '100%', height: '45.5em', borderRadius: '3px', border: '1px solid #cdcdcd'}}
                                                   sourceCode={templateText}/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Tab>
                <Tab key={'metadata'} eventKey={2} title="Metadata">
                    <Grid fluid={ true } style={{marginTop: '1em'}}>
                        <Row style={ { position: 'relative'} }>
                            <Col
                                xs={ 12 }
                                md={ 6 }
                                sm={ 6 }
                                lg={ 6 }>
                                <div style={cellBoxStyle}>
                                    <div style={{width: '100%', paddingTop: '2em'}}>
                                        <Tabs activeKey={this.state.activeMetahelpTabKey} animation={false} onSelect={this.handleMetahelpTabSelect}>
                                            <Tab key="editor" eventKey={1} title="Metadata help markdown">
                                                <AceEditor id="metahelpEditor"
                                                           ref="metahelpEditor"
                                                           mode="ace/mode/markdown"
                                                           sourceName="metahelp"
                                                           style={{width: '100%', marginTop: '1em', height: '42.5em', borderRadius: '3px', border: '1px solid #cdcdcd'}}
                                                           sourceCode={metahelp}/>
                                            </Tab>
                                            <Tab key="preview" eventKey={2} title="Preview">
                                                <div dangerouslySetInnerHTML={{__html: metahelpPreview}}></div>
                                            </Tab>
                                        </Tabs>
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
                                        <small>Edit metadata defaults</small>
                                        <AceEditor id="metadataEditor"
                                                   ref="metadataEditor"
                                                   mode="ace/mode/json"
                                                   sourceName="metadata"
                                                   style={{width: '100%', height: '45.5em', borderRadius: '3px', border: '1px solid #cdcdcd'}}
                                                   sourceCode={JSON.stringify(metadata, null, 4)}/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Tab>
                <Tab key={'dependencies'} eventKey={3} title="Dependencies">
                    <Grid fluid={ true } style={{marginTop: '1em'}}>
                        <Row style={ { position: 'relative'} }>
                            <Col
                                xs={ 12 }
                                md={ 6 }
                                sm={ 6 }
                                lg={ 6 }>
                                <div style={cellBoxStyle}>
                                    <div style={{width: '100%', paddingTop: '2em'}}>
                                        <div dangerouslySetInnerHTML={{__html: depsHelp }}></div>
                                    </div>
                                </div>
                                <p>Example:</p>
                                <div style={cellBoxStyle}>
                                    <div style={{width: '100%'}}>
                                        <code style={{padding: '0px'}}><pre style={{fontSize: '10px'}}>{depsExample}</pre></code>
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
                                        <small>Edit dependencies</small>
                                        <AceEditor id="dependenciesEditor"
                                                   ref="dependenciesEditor"
                                                   mode="ace/mode/json"
                                                   sourceName="dependecies"
                                                   style={{width: '100%', height: '45.5em', borderRadius: '3px', border: '1px solid #cdcdcd'}}
                                                   sourceCode={JSON.stringify(dependencies, null, 4)}/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Tab>
                <Tab key={'readme'} eventKey={4} title="Generator readme">
                    <Grid fluid={ true } style={{marginTop: '1em'}}>
                        <Row style={ { position: 'relative'} }>
                            <Col
                                xs={ 12 }
                                md={ 12 }
                                sm={ 12 }
                                lg={ 12 }>
                                <div style={cellBoxStyle}>
                                    <div style={{width: '100%', height: '100%', paddingTop: '2em'}}>
                                        <Tabs activeKey={this.state.activeReadmeTabKey} animation={false} onSelect={this.handleReadmeTabSelect}>
                                            <Tab key="editor" eventKey={1} title="Generator description markdown">
                                                <AceEditor id="readmeEditor"
                                                           ref="readmeEditor"
                                                           mode="ace/mode/markdown"
                                                           sourceName="readme"
                                                           style={{width: '100%', marginTop: '1em', height: '42.5em', borderRadius: '3px', border: '1px solid #cdcdcd'}}
                                                           sourceCode={readme}/>
                                            </Tab>
                                            <Tab key="preview" eventKey={2} title="Preview">
                                                <div dangerouslySetInnerHTML={{__html: readmePreview}}></div>
                                            </Tab>
                                        </Tabs>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Tab>
                <Tab key={'sampleModel'} eventKey={5} title="Sample model">
                    <Grid fluid={ true } style={{marginTop: '1em'}}>
                        <Row style={ { position: 'relative'} }>
                            <Col
                                xs={ 12 }
                                md={ 12 }
                                sm={ 12 }
                                lg={ 12 }>
                                <div style={cellBoxStyle}>
                                    <div style={{paddingTop: '2em'}} >
                                        <pre ref="sampleModelCode"><code>
                                            {JSON.stringify(model, null, 4)}
                                        </code></pre>
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

