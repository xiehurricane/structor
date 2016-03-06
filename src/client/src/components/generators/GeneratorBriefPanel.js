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
import { Grid, Row, Col, Panel, SplitButton, MenuItem, Button } from 'react-bootstrap';
import marked from 'marked';
import { makeRequest } from '../../api/restApi.js';

class GeneratorBriefPanel extends Component {

    constructor(props, content) {
        super(props, content);
        this.handleOnInstallVersion = this.handleOnInstallVersion.bind(this);
        this.handleOnUninstallVersion = this.handleOnUninstallVersion.bind(this);
        this.state = {
            html: ''
        };
    }
    componentDidMount() {
        const {generatorKey, docName} = this.props;
        if(generatorKey){
            makeRequest('getGeneratorBriefText', {generatorKey})
                .then(response => {
                    if(response.data && response.data.briefText){
                        let html = null;
                        try{
                            html = marked(response.data.briefText);
                        } catch(e){}
                        this.setState({ html });
                    }
                });
        }
    }
    handleOnInstallVersion(e){
        e.preventDefault();
        e.stopPropagation();
        const {onInstallVersion} = this.props;
        if(onInstallVersion){
            onInstallVersion(e.currentTarget.dataset.key, e.currentTarget.dataset.version);
        }
    }
    handleOnUninstallVersion(e){
        e.preventDefault();
        e.stopPropagation();
        const {onUninstallVersion} = this.props;
        if(onUninstallVersion){
            onUninstallVersion(e.currentTarget.dataset.key);
        }
    }
    render() {
        const {generatorKey, versions, projectRepo, installedVersion} = this.props;
        let imgUrl = null;
        if(generatorKey){
            imgUrl = 'http://localhost/genclient/' + projectRepo + '/' + generatorKey.replace(/\./g,'/') + '/screenshot.png';
        }
        let installButton = null;
        if(versions){
            const versionsList = versions.split(',');
            let menuItems = [];
            if(versionsList && versionsList.length > 0){
                versionsList.forEach((item, index) => {
                    menuItems.push(
                        <MenuItem key={index}
                                  eventKey={index + 1}
                                  data-key={generatorKey}
                                  data-version={item}
                                  onClick={this.handleOnInstallVersion}>
                            {'Version ' + item}
                        </MenuItem>
                    );
                });
                installButton = (
                    <SplitButton id="installButton"
                                 data-key={generatorKey}
                                 data-version={versionsList[versionsList.length-1]}
                                 onClick={this.handleOnInstallVersion}
                                 title="Install"
                                 bsStyle="primary">
                        {menuItems}
                    </SplitButton>
                );
            }
        }
        let uninstallButton = null;
        if(installedVersion){
            uninstallButton = (
                <Button bsStyle="default"
                        data-key={generatorKey}
                        onClick={this.handleOnUninstallVersion} >
                    <span>Uninstall</span>
                </Button>
            );
        }
        return (<div {...this.props}>
                    <Panel>
                        <h5 style={ { marginBottom : "1.5em", position: 'relative'} }>
                            <small style={ {    "marginRight": "0.5em"} } >Key :</small>
                            <span>{ generatorKey }</span>
                        </h5>
                        <Grid fluid={ true }>
                            <Row>
                                <Col
                                     xs={ 12 }
                                     md={ 4 }
                                     sm={ 4 }
                                     lg={ 4 }>
                                <div>
                                    <img
                                         src={imgUrl}
                                         style={ {    "width": "100%"} } />
                                    <div style={{marginTop: '1em'}}>
                                        {installedVersion ?
                                            <p><small>Installed version: </small><span>{installedVersion}</span></p>
                                            :
                                            null
                                        }
                                        {installButton}
                                        {uninstallButton}
                                    </div>
                                </div>
                                </Col>
                                <Col
                                     xs={ 12 }
                                     md={ 8 }
                                     sm={ 8 }
                                     lg={ 8 }>
                                <div>
                                    <div dangerouslySetInnerHTML={{__html: this.state.html}}></div>
                                </div>
                                <p style={{ marginTop: '2em'}}>
                                    <a target="__blank" href={'http://localhost/generator?key=' + generatorKey + '&repo=' + projectRepo}>
                                        <i className="fa fa-external-link"></i>
                                        <span style={{marginLeft: '0.5em'}}>Read more...</span>
                                    </a>
                                </p>
                                </Col>
                            </Row>
                        </Grid>
                    </Panel>
                </div>
            );
    }
}
GeneratorBriefPanel.defaultProps = {
    generatorKey: null,
    projectRepo: null,
    installedVersion: null,
    versions: null,
    onInstallVersion: null,
    onUninstallVersion: null
};
GeneratorBriefPanel.propTypes = {
    generatorKey: PropTypes.string,
    projectRepo: PropTypes.string,
    installedVersion: PropTypes.string,
    versions: PropTypes.string,
    onInstallVersion: PropTypes.func,
    onUninstallVersion: PropTypes.func
};

export default GeneratorBriefPanel;
