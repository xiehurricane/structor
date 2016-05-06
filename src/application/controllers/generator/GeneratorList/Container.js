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
import { ListGroup, ListGroupItem, Tabs, Tab, Pagination } from 'react-bootstrap';
import GeneratorBriefPanel from '../GeneratorBriefPanel';
import { GeneratorKeyTitleView } from '../../../views';

class Container extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            itemsPerPage: 10
        };
        this.handleChangeCatalog = this.handleChangeCatalog.bind(this);
        this.handleChangeBackCatalog = this.handleChangeBackCatalog.bind(this);
        this.handleTabSelect = this.handleTabSelect.bind(this);
        this.handlePageSelect = this.handlePageSelect.bind(this);
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

    handleTabSelect(eventKey){
        if(eventKey){
            this.props.setSelectedTab(eventKey);
        }
    }

    handlePageSelect(event, selectedEvent){
        this.setState({
            activePage: parseInt(selectedEvent.eventKey)
        });
    }

    render(){

        const { componentModel: {generators, recentGenerators, selectedTabKey, filter} } = this.props;
        const { generatorModel: {loadOptions}, toggleGenerics } = this.props;
        const { activePage, itemsPerPage } = this.state;
        const { groupKey, groupName, groupNameBack } = filter;
        let pageCount = 0;

        let generatorGroupCatalogs = [];
        let headGroupItems = [];
        let generatorGroup;
        let generatorPanelList = [];
        let generatorGroupCount = 0;
        if(selectedTabKey === 1){
            generatorGroup = generators[ALL_GROUP_KEY];
            if (generatorGroup.files && generatorGroup.files.length > 0
                && recentGenerators && recentGenerators.length > 0) {
                let tempGeneratorPanelList = [];
                let sortIndex;
                generatorGroup.files.forEach((item, index) => {
                    sortIndex = recentGenerators.indexOf(item.generatorId);
                    if(sortIndex >= 0){
                        tempGeneratorPanelList.push({
                            index: sortIndex,
                            element: <GeneratorBriefPanel key={ item.generatorId }
                                                          generatorKey={item.dirNamePath}
                                                          userId={item.userId}
                                                          generatorId={item.generatorId}
                                                          versions={item.versions}
                                                          isRecentPanel={true}/>
                        });
                    }
                });
                tempGeneratorPanelList.sort((a, b) => a.index - b.index);
                tempGeneratorPanelList.forEach(item => {
                    generatorPanelList.push(item.element);
                });
            }
        } else if(selectedTabKey === 2){
            generatorGroup = generators[groupKey];
            headGroupItems.push(
                <ListGroupItem href="#"
                               key={'allFiles'}
                               data-catalog="All"
                               data-catalog-name="All"
                               style={{position: 'relative', outline: 0}}
                               onClick={this.handleChangeCatalog}>
                    <i style={{margin: '0 1em 0 0'}} className="fa fa-reply-all"></i>
                    <span>Reset filter</span>
                </ListGroupItem>
            );
            if(this.groupsHistory.length > 0){
                headGroupItems.push(
                    <ListGroupItem href="#"
                                   key={'backNavigation'}
                                   style={{position: 'relative', outline: 0}}
                                   style={{position: 'relative'}}
                                   onClick={this.handleChangeBackCatalog}>
                        <i style={{margin: '0 1em 0 0'}} className="fa fa-chevron-left"></i>
                        <span>{groupNameBack}</span>
                    </ListGroupItem>
                );
            }
            if(generatorGroup){
                if(generatorGroup.catalogs && generatorGroup.catalogs.length > 0){
                    generatorGroup.catalogs.forEach( (catalog, index) => {
                        const childGeneratorGroup = generators[catalog.dirNamePath];
                        const childGeneratorGroupCount = childGeneratorGroup && childGeneratorGroup.files ? childGeneratorGroup.files.length || 0 : 0;
                        generatorGroupCatalogs.push(
                            <ListGroupItem href="#"
                                           key={'catalog' + index}
                                           style={{position: 'relative', outline: 0}}
                                           data-catalog={catalog.dirNamePath}
                                           data-catalog-name={catalog.dirName}
                                           onClick={this.handleChangeCatalog}>
                                <span style={{margin: '0 1em 0 0'}}>
                                    <span className="fa fa-chevron-right"></span>
                                </span>
                                <span>{catalog.dirName}</span>
                                <span className="badge" style={{backgroundColor: '#fff', color: '#555'}}>
                                    <span>{childGeneratorGroupCount}</span>
                                </span>
                            </ListGroupItem>
                        );
                    });
                }
                if (generatorGroup.files && generatorGroup.files.length > 0) {
                    generatorGroupCount = generatorGroup.files.length;
                    const lowerBound = (activePage - 1) * itemsPerPage;
                    const higherBound = activePage * itemsPerPage;
                    generatorGroup.files.forEach((item, index) => {
                        if(index < higherBound && index >= lowerBound ){
                            generatorPanelList.push(<GeneratorBriefPanel key={ item.generatorId }
                                                                         generatorKey={item.dirNamePath}
                                                                         userId={item.userId}
                                                                         generatorId={item.generatorId}
                                                                         versions={item.versions}/>);
                        }
                    });
                    pageCount = parseInt(generatorGroup.files.length / itemsPerPage);
                    if(pageCount > 0 && parseInt(generatorGroup.files.length % itemsPerPage) > 0){
                        pageCount += 1;
                    }

                }

            }
        }

        return (
            <Tabs activeKey={selectedTabKey}
                  onSelect={this.handleTabSelect}
                  id="generatorListTabs"
                  animation={false}>
                <Tab key={'favoriteGenerators'}
                     eventKey={1}
                     title='Recently used'>
                    <Grid fluid={ true }>
                        <Row style={ { minHeight: "40em", position: 'relative'} }>
                            <Col xs={ 12 } md={ 8 } sm={ 12 } lg={ 8 } mdOffset={2} lgOffset={2}>
                                <div style={{marginTop: '2em'}}>
                                    {generatorPanelList}
                                </div>
                            </Col>
                        </Row>
                    </Grid>

                </Tab>
                <Tab key={'allAvailableGenerators'}
                     eventKey={2}
                     title='All available generators'>
                    <div>
                        <h5 className='text-center'>
                            <small>{'Category:  '}</small>
                            <GeneratorKeyTitleView generatorKey={groupKey} />
                        </h5>
                        <Grid fluid={ true }>
                            <Row style={ { minHeight: "40em", position: 'relative'} }>
                                <Col
                                    xs={ 12 }
                                    md={ 3 }
                                    sm={ 3 }
                                    lg={ 3 }>

                                    <ListGroup>
                                        <ListGroupItem active={loadOptions.isOnlyGenerics}
                                                       href="#"
                                                       onClick={(e) => {e.stopPropagation(); e.preventDefault(); toggleGenerics(); }}>
                                            <span>Only generic generators</span>
                                        </ListGroupItem>
                                    </ListGroup>
                                    <ListGroup>
                                        {headGroupItems}
                                        <ListGroupItem active={true}>
                                            <span>{groupName}</span>
                                            <span className="badge">
                                                <span>{generatorGroupCount}</span>
                                            </span>
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
                                    <div style={{margin: '1em 0'}}>
                                        <Pagination bsSize="medium"
                                                    items={pageCount}
                                                    activePage={activePage}
                                                    prev={true}
                                                    next={true}
                                                    first={true}
                                                    last={true}
                                                    ellipsis={true}
                                                    maxButtons={5}
                                                    onSelect={this.handlePageSelect}>
                                        </Pagination>
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                </Tab>
            </Tabs>
        );

    }

}

export default connect(modelSelector, containerActions)(Container);

