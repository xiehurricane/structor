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

import { Grid, Row, Col, Panel, SplitButton, MenuItem, Button } from 'react-bootstrap';
import marked from 'marked';

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleOnSelect = this.handleOnSelect.bind(this);
    }

    componentDidMount(){
        const { projectId, userId, generatorId, getGeneratorInfo } = this.props;
        getGeneratorInfo(projectId, userId, generatorId);
    }

    shouldComponentUpdate(nextProps, nextState){
        return this.props.generatorId === nextProps.generatorId;
    }

    handleOnSelect(e){
        e.preventDefault();
        e.stopPropagation();
        const { generatorId, pregenerate } = this.props;
        const version = e.currentTarget.dataset.version;
        pregenerate(generatorId, version);
    }

    render() {
        const { projectId, userId, generatorId, versions} = this.props;
        const { componentModel: {infos}, generatorKey } = this.props;
        const brief = infos[generatorId] ? marked(infos[generatorId].brief) : '';

        let imgUrl = null;
        if(generatorKey){
            imgUrl = window.serviceUrl + '/sm/public/generator/info/' + projectId + '/' + userId + '/' + generatorId + '/screenshot.png';
        }
        let selectButton = null;
        if(versions){
            const versionsList = versions.split(',');
            let menuItems = [];
            if(versionsList && versionsList.length > 0){
                versionsList.forEach((item, index) => {
                    menuItems.push(
                        <MenuItem key={index}
                                  eventKey={index + 1}
                                  data-version={item}
                                  onClick={this.handleOnSelect}>
                            {'Version ' + item}
                        </MenuItem>
                    );
                });
                selectButton = (
                    <SplitButton id="selectButton"
                                 data-version={versionsList[versionsList.length-1]}
                                 onClick={this.handleOnSelect}
                                 title="Invoke generator"
                                 bsStyle="primary">
                        {menuItems}
                    </SplitButton>
                );
            }
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
                                        {selectButton}
                                    </div>
                                </div>
                            </Col>
                            <Col
                                xs={ 12 }
                                md={ 8 }
                                sm={ 8 }
                                lg={ 8 }>
                                <div>
                                    <div dangerouslySetInnerHTML={{__html: brief}}></div>
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
        );
    }
}

Container.defaultProps = {
    projectId: undefined,
    userId: undefined,
    generatorId: undefined,
    versions: undefined,
    generatorKey: undefined
};
Container.propTypes = {
    projectId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    generatorId: PropTypes.number.isRequired,
    versions: PropTypes.string.isRequired,
    generatorKey: PropTypes.string.isRequired
};

export default connect( modelSelector, containerActions)(Container);

