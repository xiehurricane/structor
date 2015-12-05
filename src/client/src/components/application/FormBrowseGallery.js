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
import { Grid, Row, Col, Panel, Alert, Button, Input, ListGroup, ListGroupItem } from 'react-bootstrap';
import * as ServerActions from '../../actions/serverActions.js';
import CollapsibleLabel from '../element/CollapsibleLabel.js';
import ProjectThumbnail from './ProjectThumbnail.js';

class FormBrowseGallery extends Component {

    constructor(props) {
        super(props);
        this.handleCloneProject = this.handleCloneProject.bind(this);
        //this.handleLogout = this.handleLogout.bind(this);
        //this.handleLogin = this.handleLogin.bind(this);
    }

    componentDidMount(){
        this.props.serverInvoke('getProjectGallery', {}, [ServerActions.DATA_GALLERY_PROJECTS]);
    }

    handleCloneProject(downloadUrl){
        this.props.serverInvoke('downloadProject', { downloadUrl: downloadUrl }, [ServerActions.DATA_PROJECT_CLONED]);
    }

    render(){
        const { galleryProjects } = this.props;
        let projectThumbnails = [];
        if(galleryProjects && galleryProjects.length > 0){
            for(let i = 0; i < galleryProjects.length; i += 2){
                projectThumbnails.push(
                    <Row key={'row' + i}>
                        <Col key={'1'} xs={12} md={6} sm={6} lg={6}>
                            <ProjectThumbnail
                                projectInfo={galleryProjects[i]}
                                onCloneProject={this.handleCloneProject} />
                        </Col>
                        <Col key={'2'} xs={12} md={6} sm={6} lg={6}>
                            <ProjectThumbnail
                                projectInfo={galleryProjects[i+1]}
                                onCloneProject={this.handleCloneProject} />
                        </Col>
                    </Row>
                );
            }
        }
        return (
            <Grid fluent={true} style={{marginTop: '70px'}}>
                <CollapsibleLabel style={{margin: '0.3em 0 0.3em 0'}} title="Legal stuff">
                    <div style={{padding: '1em'}}>
                        <p>Data published to the Structor Market is not part of Structor Market itself,
                            and is the sole property of the publisher. While every effort is made to ensure accountability,
                            there is absolutely no guarantee, warranty, or assertion expressed or implied as to the quality,
                            fitness for a specific purpose, or lack of malice in any given project in the gallery.</p>
                        <p>If you have a complaint about a project in the gallery,
                            please email&nbsp;&nbsp;<a href='mailto:support@helmetrex.com'>support(at)helmetrex.com</a>
                            &nbsp;&nbsp;and explain the situation.</p>
                        <p>Any data published to the Structor Market (including user account information)
                            may be removed or modified at the sole discretion of the Structor Market administration.</p>
                        <p className='lead'>Users can publish Bad Stuff. It will be removed promptly if reported.
                            But there is no vetting process for published projects, and you use them at your own risk.
                            Please inspect the source code.
                        </p>
                    </div>
                </CollapsibleLabel>
                {projectThumbnails}
            </Grid>
        );
    }

}


function mapStateToProps(state) {
    const { server } = state;
    return {
        galleryProjects: server.gallery.projects
    };
}

export default connect(
    mapStateToProps,
    {
        serverInvoke: ServerActions.invoke
    }
)(FormBrowseGallery);
