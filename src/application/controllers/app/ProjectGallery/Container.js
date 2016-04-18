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

import { ProjectPanel } from '../../../views';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.getProjectGalleryList();
    }

    render(){
        const { componentModel:{projectList}, downloadProject } = this.props;

        let listItems = [];
        if(projectList && projectList.length > 0){
            projectList.forEach(project => {
                listItems.push(
                    <ProjectPanel description={project.description}
                                  screenshotUrl={project.screenshotUrl}
                                  githubRepoUrl={project.htmlUrl}
                                  downloadUrl={project.downloadUrl}
                                  readmeHtmlText={project.htmlReadmeText}
                                  githubOwner={project.owner}
                                  githubRepo={project.repo}
                                  projectId={project.projectId} onDownload={downloadProject} />
                );
            });
        }

        return (
            <div ref="containerElement"
                 style={{position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px', overflow: 'auto'}}>
                <div style={{padding: '2em 2em 2em 2em' }}>
                    <h3 style={{marginBottom: '1em'}} className="text-center">Available projects to download</h3>
                    {listItems}
                </div>
            </div>
        );
    }
}


export default connect(modelSelector, containerActions)(Container);

