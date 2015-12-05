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
import { Panel } from 'react-bootstrap';
import marked from 'marked';

class ProjectThumbnail extends Component {

    constructor(props) {
        super(props);
        this.handleClone = this.handleClone.bind(this);
    }

    handleClone(e){
        e.stopPropagation();
        e.preventDefault();
        if(this.props.onCloneProject){
            this.props.onCloneProject(this.props.projectInfo.downloadUrl);
        }
    }

    render(){

        const projectInfo = this.props.projectInfo;

        if(projectInfo.isEmpty){
            return (
                <div></div>
            );
        } else {
            let projectName = projectInfo.name;
            if(projectName && projectName.length > 50){
                projectName = projectName.substr(0, 50) + '...';
            }
            let innerHtml = projectInfo.description;
            return (
                <Panel>
                    <div style={{display: 'table', width: '100%'}}>
                        <div style={{display: 'table-row'}}>
                            <div style={{display: 'table-cell'}}>
                                <h4 className={'text-danger'} style={{marginTop: '5px'}}>
                            <span style={{display: 'inline'}} >
                                {projectName}
                            </span>
                                </h4>
                            </div>
                            <div style={{display: 'table-cell', width: '50%', verticalAlign: 'top', textAlign: "right", paddingLeft: '0.5em', paddingRight: '0.5em', paddingTop: '0.5em', paddingBottom: '0.5em'} }>
                                <a href={projectInfo.htmlUrl}
                                   target="blank"
                                   style={{marginLeft: '1em'}}>
                                    <span className='fa fa-external-link fa-fw'></span>&nbsp;Details
                                </a>
                                <a href='#' style={{marginLeft: '1em'}} onClick={this.handleClone}>
                                    <span className='fa fa-cloud-download fa-fw'></span>&nbsp;<span >Clone</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <p>
                        <span className="fa fa-star fa-fw"></span>
                        <small style={{ marginLeft: '0.5em' }}>{projectInfo.starsCount}</small>
                    </p>
                    {/*<hr style={{marginTop: '5px', marginBottom: '5px'}}></hr>*/}
                    <div style={{height: '17em', overflow: 'hidden'}}>
                        { !!projectInfo.screenshotUrl ?
                            <img style={{width: '100%'}} src={projectInfo.screenshotUrl}></img> :
                            <p>File 'screenshot.png' is missing, please add one into the root folder on GitHub</p>
                        }
                    </div>
                    <div style={{height: '6em', overflow: 'hidden', marginTop: '1em'}}>
                        <h5>{innerHtml}</h5>
                    </div>
                </Panel>

            );
        }
    }
}

export default ProjectThumbnail;