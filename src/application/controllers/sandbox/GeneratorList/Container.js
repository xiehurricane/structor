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
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions, ALL_GROUP_KEY } from './actions.js';

import { Button, Grid, Row, Col } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import GeneratorBriefPanel from '../GeneratorBriefPanel';

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleChangeCatalog = this.handleChangeCatalog.bind(this);
        this.handleChangeBackCatalog = this.handleChangeBackCatalog.bind(this);
        this.groupsHistory = [];
    }

    handleChangeCatalog(e) {
        e.preventDefault();
        e.stopPropagation();
        const newGroupKey = e.currentTarget.attributes['data-catalog'].value;
        const newGroupName = e.currentTarget.attributes['data-catalog-name'].value;
        if(newGroupKey){
            let newGroupNameBack = null;
            if(newGroupKey !== ALL_GROUP_KEY){
                const { groupKey, groupName, groupNameBack } = this.props.componentModel.filter;
                newGroupNameBack = groupName;
                this.groupsHistory.push({ groupKey, groupName, groupNameBack});
            } else {
                this.groupsHistory = [];
            }
            this.props.setFilter({
                groupKey: newGroupKey,
                groupName: newGroupName,
                groupNameBack: newGroupNameBack
            });
        }
    }

    handleChangeBackCatalog(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.groupsHistory.length > 0){
            const { groupKey, groupName, groupNameBack } = this.groupsHistory.pop();
            if(groupKey){
                this.props.setFilter({
                    groupKey,
                    groupName,
                    groupNameBack
                });
            }
        }
    }

    render(){

        const { componentModel: {generators, filter} } = this.props;

        let generatorGroupCatalogs = [];
        let headGroupItems = [];
        const { groupKey, groupName, groupNameBack } = filter;
        const generatorGroup = generators[groupKey];
        headGroupItems.push(
            <ListGroupItem href="#"
                           key={'allFiles'}
                           data-catalog="All"
                           data-catalog-name="All"
                           style={{position: 'relative'}}
                           onClick={this.handleChangeCatalog}>
                <span>Reset filter</span>
                <span className="badge" style={{backgroundColor: '#fff', color: '#555'}}>
                    <span className="fa fa-reply-all"></span>
                </span>
            </ListGroupItem>
        );
        if(this.groupsHistory.length > 0){
            headGroupItems.push(
                <ListGroupItem href="#"
                               key={'backNavigation'}
                               style={{position: 'relative'}}
                               onClick={this.handleChangeBackCatalog}>
                    <span>{groupNameBack}</span>
                        <span className="badge" style={{backgroundColor: '#fff', color: '#555'}}>
                            <span className="fa fa-reply"></span>
                        </span>

                </ListGroupItem>
            );
        }
        let generatorPanelList = [];
        if(generatorGroup){
            if(generatorGroup.catalogs && generatorGroup.catalogs.length > 0){
                generatorGroup.catalogs.forEach( (catalog, index) => {
                    generatorGroupCatalogs.push(
                        <ListGroupItem href="#"
                                       className="list-group-item"
                                       key={'catalog' + index}
                                       style={{position: 'relative'}}
                                       data-catalog={catalog.dirNamePath}
                                       data-catalog-name={catalog.dirName}
                                       onClick={this.handleChangeCatalog}>
                            <span>{catalog.dirName}</span>
                                <span className="badge" style={{backgroundColor: '#fff', color: '#555'}}>
                                    <span className="fa fa-chevron-right"></span>
                                </span>
                        </ListGroupItem>
                    );
                });
            }
            if (generatorGroup.files && generatorGroup.files.length > 0) {
                generatorGroup.files.forEach((item, index) => {
                    generatorPanelList.push(<GeneratorBriefPanel key={ item.generatorId }
                                                                 generatorKey={item.dirNamePath}
                                                                 projectId={item.projectId}
                                                                 userId={item.userId}
                                                                 generatorId={item.generatorId}
                                                                 versions={item.versions}/>);
                });
            }

        }
        return (
            <div>
                <h5 className='text-center'>
                    <small>{'Category:  '}</small>
                    <span>{groupKey}</span>
                </h5>
                <Grid fluid={ true }>
                    <Row style={ { minHeight: "40em", position: 'relative'} }>
                        <Col
                            xs={ 12 }
                            md={ 3 }
                            sm={ 3 }
                            lg={ 3 }>

                            <ListGroup>
                                {headGroupItems}
                                <ListGroupItem active={true}>
                                    <span>{groupName}</span>
                                </ListGroupItem>
                                {generatorGroupCatalogs}
                            </ListGroup>

                        </Col>
                        <Col
                            xs={ 12 }
                            md={ 9 }
                            sm={ 9 }
                            lg={ 9 }>

                            {generatorPanelList}

                        </Col>
                    </Row>
                </Grid>
            </div>
        );

    }

}

export default connect(modelSelector, containerActions)(Container);

