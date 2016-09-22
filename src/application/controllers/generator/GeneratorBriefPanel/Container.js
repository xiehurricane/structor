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
        this.handleOnDelete = this.handleOnDelete.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.state = {
            isExpanded: false
        };
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
        const { generatorId, generatorKey, pregenerate } = this.props;
        const version = e.currentTarget.dataset.version;
        pregenerate(generatorId, generatorKey, version);
    }

    handleOnDelete(e){
        e.preventDefault();
        e.stopPropagation();
        if(confirm('This operation is undoable. Please confirm the generator deleting from the market.')){
            const { generatorId, removeGenerator } = this.props;
            removeGenerator(generatorId);
        }
    }

    handleExpand(e){
        e.preventDefault();
        e.stopPropagation();
        const {isExpanded} = this.state;
        if(isExpanded){
            const panelOffset = $(this.panel).offset();
            const $body = $('#containerElement');
            let diff = (panelOffset.top + $body.scrollTop()) - $body.offset().top;
            let margin = 90;
            $body.animate(
                { scrollTop: (diff - margin) },
                300
            );
            setTimeout(() => {
                this.setState({isExpanded: !isExpanded});
            }, 300);
        } else {
            this.setState({isExpanded: !isExpanded});
        }
    }

    render() {
        const {isExpanded} = this.state;
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
        let deleteButton = null;
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
                                 title="Generate"
                                 bsStyle="default" bsSize="xs">
                        {menuItems}
                    </SplitButton>
                );
            }
        }
        if(accountUserId === userId){
            deleteButton = (
                <Button
                    id="deleteButton"
                    onClick={this.handleOnDelete}
                    title="Generate"
                    bsStyle="default" bsSize="xs">
                    Delete
                </Button>
            );
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
        // const innerCellStyle = {
        //     transform: isExpanded ? "translate(0%)" : "translate(-100%)",
        //     transition: "transform 500ms ease-in-out",
        //     height: isExpanded ? '100%' : '20em',
        //     overflow: 'hidden'
        // };
        return (
            <div ref={me => this.panel = me}>
                <Panel>
                    { isRecentPanel ?
                        <i style={closeButtonStyle}
                           title="Remove from recently used list"
                           className="fa fa-times-circle"
                           onClick={() => {removeFromRecentGenerators(generatorId);}} />
                        : null
                    }
                    <h5 style={{margin : "0px", position: 'relative', padding: '3px', backgroundColor: '#f5f5f5', borderRadius: '3px'}}>
                        {selectButton}
                        <GeneratorKeyTitleView style={{marginLeft: '1em', marginRight: '1em'}} generatorKey={generatorKey} />
                        {deleteButton}
                    </h5>
                    <Grid fluid={ true }>
                        <Row>
                            <Col
                                xs={ 12 }
                                md={ 8 }
                                sm={ 8 }
                                lg={ 8 } style={{paddingLeft: '0px'}}>
                                <div style={{height: isExpanded ? '100%' : '20em', overflow: 'hidden'}}>
                                    <div dangerouslySetInnerHTML={{__html: brief}}></div>
                                </div>
                            </Col>
                            <Col
                                xs={ 12 }
                                md={ 4 }
                                sm={ 4 }
                                lg={ 4 }>
                                <div style={{height: isExpanded ? '100%' : '20em', overflow: 'hidden'}}>
                                    <img
                                        src={imgUrl}
                                        style={{ "width": "100%"}} />
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                    <div style={{margin: '1em 0px 0px 0px', width: '100%'}}>
                        <a href="#"
                           onClick={this.handleExpand} >
                            <i className={"fa " + (isExpanded ? "fa-caret-up" : "fa-caret-down")} />
                            <span style={{marginLeft: '0.5em'}}>{isExpanded ? "Read less" : 'Read more'}</span>
                        </a>
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

