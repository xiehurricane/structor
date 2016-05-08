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

import { Grid, Row, Col, Panel, SplitButton, MenuItem, Button, ButtonGroup } from 'react-bootstrap';
import { GeneratorKeyTitleView } from '../../../views';
import marked from 'marked';

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.handleOnClone = this.handleOnClone.bind(this);
        this.handleOnUpdate = this.handleOnUpdate.bind(this);
    }

    componentDidMount(){
        const { userId, generatorId, getGeneratorInfo } = this.props;
        getGeneratorInfo(userId, generatorId);
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

    handleOnClone(e){
        e.preventDefault();
        e.stopPropagation();
        const { generatorId, setGeneratorSample, userId, generatorKey } = this.props;
        const version = e.currentTarget.dataset.version;
        setGeneratorSample(generatorId, version, generatorKey, userId, true);
    }

    handleOnUpdate(e){
        e.preventDefault();
        e.stopPropagation();
        const { generatorId, setGeneratorSample, userId, generatorKey } = this.props;
        const version = e.currentTarget.dataset.version;
        setGeneratorSample(generatorId, version, generatorKey, userId, false);
    }

    render() {
        const { userId, generatorId, versions, isRecentPanel, removeFromRecentGenerators } = this.props;
        const { componentModel: {infos}, generatorKey } = this.props;
        const { appContainerModel: {userAccount: {userId: accountUserId}} } = this.props;
        const brief = infos[generatorId] ? marked(infos[generatorId].brief) : '';

        let imgUrl = null;
        let readmeUrl = '#';
        if(generatorKey){
            imgUrl = window.serviceUrl + '/sm/public/generator/info/' + userId + '/' + generatorId + '/screenshot.png';
            readmeUrl = window.serviceUrl + '/generator?key=' + generatorKey + '&userId=' + userId + '&generatorId=' + generatorId;
        }
        let selectButton = null;
        let cloneButton = null;
        let updateButton = null;
        if(versions){
            const versionsList = versions.split(',');
            let menuItems = [];
            let cloneMenuItems = [];
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
                    cloneMenuItems.push(
                        <MenuItem key={index}
                                  eventKey={index + 1}
                                  data-version={item}
                                  onClick={this.handleOnClone}>
                            {'Version ' + item}
                        </MenuItem>
                    );
                });
                selectButton = (
                    <SplitButton id="selectButton"
                                 data-version={versionsList[versionsList.length-1]}
                                 onClick={this.handleOnSelect}
                                 title="Run generator"
                                 bsStyle="primary" bsSize="xs">
                        {menuItems}
                    </SplitButton>
                );
                cloneButton = (
                    <SplitButton id="cloneButton"
                                 style={{marginLeft: '0.5em'}}
                                 data-version={versionsList[versionsList.length-1]}
                                 onClick={this.handleOnClone}
                                 title="Fork generator"
                                 bsStyle="default" bsSize="xs">
                        {cloneMenuItems}
                    </SplitButton>
                );
                if(userId === accountUserId){
                    updateButton = (
                        <SplitButton id="cloneButton"
                                     style={{marginLeft: '0.5em'}}
                                     data-version={versionsList[versionsList.length-1]}
                                     onClick={this.handleOnUpdate}
                                     title="Update version"
                                     bsStyle="default" bsSize="xs">
                            {cloneMenuItems}
                        </SplitButton>
                    );
                }
            }
        }
        const closeButtonStyle = {
            position: 'absolute',
            top: '-0.5em',
            right: '-0.5em',
            width: '1em',
            height: '1em',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: '100',
            opacity: '0.5'
        };
        return (<div {...this.props}>
                <Panel>
                    { isRecentPanel ?
                        <i style={closeButtonStyle}
                           title="Remove from recently used list"
                           className="fa fa-times-circle"
                           onClick={() => {removeFromRecentGenerators(generatorId);}}></i>
                        : null
                    }
                    <h5 style={ { marginBottom : "1em", position: 'relative'} }>
                        <small style={ {    "marginRight": "0.5em"} } >Key :</small>
                        <GeneratorKeyTitleView generatorKey={generatorKey} />
                    </h5>
                    <Grid fluid={ true }>
                        <Row>
                            <Col
                                xs={ 12 }
                                md={ 4 }
                                sm={ 4 }
                                lg={ 4 }>
                                <div style={{height: '16em', overflow: 'hidden', marginBottom: '1em'}}>
                                    <img
                                        src={imgUrl}
                                        style={ { "width": "100%"} } />
                                </div>
                            </Col>
                            <Col
                                xs={ 12 }
                                md={ 8 }
                                sm={ 8 }
                                lg={ 8 }>
                                <div style={{height: '16em', overflow: 'auto', marginBottom: '1em'}}>
                                    <div dangerouslySetInnerHTML={{__html: brief}}></div>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                    <div style={{marginTop: '1em', width: '100%'}}>
                        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                            <div style={{minWidth: '30em', flexGrow: '1'}}>
                                {selectButton}
                                {updateButton}
                                {cloneButton}
                            </div>
                            <div style={{flexGrow: '2'}}>
                                <div style={{width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'flex-end' }}>
                                    <a target="__blank"
                                       href={readmeUrl}>
                                        <i className="fa fa-external-link"></i>
                                        <span style={{marginLeft: '0.5em'}}>Read in tab...</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </Panel>
            </div>
        );
    }
}

Container.defaultProps = {
    userId: undefined,
    generatorId: undefined,
    versions: undefined,
    generatorKey: undefined,
    isRecentPanel: undefined
};
Container.propTypes = {
    userId: PropTypes.number.isRequired,
    generatorId: PropTypes.number.isRequired,
    versions: PropTypes.string.isRequired,
    generatorKey: PropTypes.string.isRequired,
    isRecentPanel: PropTypes.bool
};

export default connect( modelSelector, containerActions)(Container);

