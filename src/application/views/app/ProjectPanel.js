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
import { Grid, Row, Col, ButtonToolbar, ButtonGroup, Button, Panel } from 'react-bootstrap';

class ProjectPanel extends Component {

    constructor(props, content) {
        super(props, content);
        this.handleOnExpandText = this.handleOnExpandText.bind(this);
        this.handleOnDownload = this.handleOnDownload.bind(this);
        this.state = {
            isReadmeExpanded: false
        }
    }

    handleOnExpandText(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            isReadmeExpanded: !this.state.isReadmeExpanded
        });
    }

    handleOnDownload(e) {
        e.preventDefault();
        e.stopPropagation();
        if(this.props.onDownload){
            this.props.onDownload(this.props.downloadUrl);
        }
    }

    render() {
        const {description, screenshotUrl, githubRepoUrl, githubOwner, githubRepo, downloadUrl, readmeHtmlText} = this.props;
        const {isReadmeExpanded} = this.state;
        let viewportReadmeHtmlHeight = '100%';
        if (!isReadmeExpanded) {
            viewportReadmeHtmlHeight = '350px';
        }
        return (<div {...this.props}>
                <Panel>
                    <Grid fluid={ true }>
                        <Row>
                            <Col
                                xs={ 12 }
                                md={ 5 }
                                sm={ 12 }
                                lg={ 5 }>
                                <div style={{height: viewportReadmeHtmlHeight, overflow: 'hidden'}}>
                                    <h4>
                                        <span>{githubOwner}</span>
                                        <span>&nbsp;/&nbsp;</span>
                                        <span>{githubRepo}</span>
                                    </h4>
                                    <img
                                        src={ screenshotUrl }
                                        style={ {    "width": "100%"} }/>
                                </div>
                                    <ButtonGroup style={{"marginTop": "1.5em"}}>
                                        <Button
                                            bsStyle="primary"
                                            onClick={ this.handleOnDownload }>
                                            <span>Clone &amp; Open</span>
                                        </Button>
                                        <Button
                                            href={ githubRepoUrl }
                                            target="_blank">
                                            <span
                                                className="fa fa-github "
                                                style={ {    "marginLeft": "0.3em",    "marginRight": "0.3em"} }></span>
                                            <span>GitHub</span>
                                        </Button>
                                    </ButtonGroup>
                            </Col>
                            <Col
                                xs={ 12 }
                                md={ 7 }
                                sm={ 12 }
                                lg={ 7 }>
                                <div style={{height: viewportReadmeHtmlHeight, overflow: 'hidden'}}>
                                    <h4><span>{description}</span></h4>
                                    <div style={{width: '100%'}}
                                        dangerouslySetInnerHTML={{__html: readmeHtmlText}}></div>
                                </div>
                                <h4 style={ {    "marginTop": "1.5em"} }>
                                    { isReadmeExpanded ?
                                        <a href="#" onClick={this.handleOnExpandText}>
                                        <span style={{margin: '0 0.5em 0 0.5em'}}
                                              className="fa fa-chevron-up"></span>
                                            <span>View less</span>
                                        </a>
                                        :
                                        <a href="#" onClick={this.handleOnExpandText}>
                                        <span style={{margin: '0 0.5em 0 0.5em'}}
                                              className="fa fa-chevron-down"></span>
                                            <span>View more</span>
                                        </a>
                                    }
                                </h4>
                            </Col>
                        </Row>
                    </Grid>
                </Panel>
            </div>
        );
    }
}

ProjectPanel.contextTypes = {
    router: PropTypes.object
};
ProjectPanel.defaultProps = {
    projectId: -1,
    description: 'Unknown',
    screenshotUrl: '',
    githubRepoUrl: '',
    downloadUrl: '',
    githubOwner: '',
    githubRepo: '',
    readmeHtmlText: '',
    onDownload: undefined
};
ProjectPanel.propTypes = {
    projectId: PropTypes.number,
    description: PropTypes.string,
    screenshotUrl: PropTypes.string,
    githubRepoUrl: PropTypes.string,
    githubOwner: PropTypes.string,
    githubRepo: PropTypes.string,
    downloadUrl: PropTypes.string,
    readmeHtmlText: PropTypes.string,
    onDownload: PropTypes.func
};


export default ProjectPanel;
