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
            this.props.onCloneProject(this.props.projectInfo.id);
        }
    }

    render(){

        const projectInfo = this.props.projectInfo;

        if(projectInfo.isEmpty){
            return (
                <div></div>
            );
        } else {
            let projectName = projectInfo.projectName;
            if(projectName && projectName.length > 50){
                projectName = projectName.substr(0, 50) + '...';
            }
            let innerHtml = marked(projectInfo.description);
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
                                <a href={'http://helmetrex.com/details/' + projectInfo.id}
                                   target="blank"
                                   style={{marginLeft: '1em'}}>
                                    <span className='fa fa-external-link fa-fw'></span>&nbsp;Details
                                </a>
                                <a href='#' style={{marginLeft: '1em'}} onClick={this.handleClone}>
                                    <span >Clone</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <p>
                        <span>{projectInfo.countDownload}</span>
                        <small style={{ marginLeft: '0.5em' }} className={ 'text-muted'}>downloads</small>
                        <small className='text-muted'>{'  |  Author: ' + projectInfo.userProfile.login}</small>
                        <small className='text-muted'>{'  |  License: ' + projectInfo.license}</small>
                    </p>
                    <hr style={{marginTop: '5px',    marginBottom: '5px'}}></hr>
                    <div style={{height: '20em', overflow: 'auto'}}>
                        <p dangerouslySetInnerHTML={ { __html: innerHtml}}></p>
                    </div>
                </Panel>

            );
        }
    }
}

export default ProjectThumbnail;