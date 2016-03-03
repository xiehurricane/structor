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

import {
    Button
} from 'react-bootstrap';

const ALL_GROUP_KEY = 'All';

class FormGeneratorList extends Component {

    constructor(props) {
        super(props);
        this.handleBackStep = this.handleBackStep.bind(this);
        this.handleInstallAdditional = this.handleInstallAdditional.bind(this);
        this.handleSubmitStep = this.handleSubmitStep.bind(this);
        this.handleChangeCatalog = this.handleChangeCatalog.bind(this);
        this.handleChangeBackCatalog = this.handleChangeBackCatalog.bind(this);
        this.groupsHistory = [];
        this.state = {
            groupKey: ALL_GROUP_KEY,
            groupName: ALL_GROUP_KEY,
            groupNameBack: null
        };
    }

    handleBackStep(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onBackStep) {
            this.props.onBackStep();
        }
    }

    handleInstallAdditional(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onBackStep) {
            this.props.onBackStep();
        }
        window.open(
            '/structor/generators.html',
            '_blank'
        );
    }

    handleSubmitStep(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onSubmitStep) {
            let generatorFilePath = e.currentTarget.attributes['data-generator-file'].value;
            this.props.onSubmitStep({
                generatorFilePath: generatorFilePath
            });
        }
    }

    handleChangeCatalog(e){
        e.preventDefault();
        e.stopPropagation();
        const newGroupKey = e.currentTarget.attributes['data-catalog'].value;
        const newGroupName = e.currentTarget.attributes['data-catalog-name'].value;
        if(newGroupKey){
            let newGroupNameBack = null;
            if(newGroupKey !== ALL_GROUP_KEY){
                const { groupKey, groupName, groupNameBack } = this.state;
                newGroupNameBack = groupName;
                this.groupsHistory.push({ groupKey, groupName, groupNameBack});
            } else {
                this.groupsHistory = [];
            }
            this.setState({
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
                this.setState({
                    groupKey,
                    groupName,
                    groupNameBack
                });
            }
        }
    }

    render() {
        let generatorGroupCatalogs = [];
        let generatorItems = [];
        let headGroupItems = [];
        const { generatorList } = this.props;
        const { groupKey, groupName, groupNameBack } = this.state;
        const generatorGroup = generatorList[groupKey];
        headGroupItems.push(
                <a href="#"
                   className="list-group-item"
                   key={'allFiles'}
                   style={{position: 'relative'}}
                   data-catalog="All"
                   data-catalog-name="All"
                   onClick={this.handleChangeCatalog}>
                    <span>Reset filter</span>
                    <span className="badge" style={{backgroundColor: '#fff', color: '#555'}}>
                        <span className="fa fa-reply-all"></span>
                    </span>
                </a>
        );
        if(this.groupsHistory.length > 0){
            headGroupItems.push(
                    <a href="#"
                       className="list-group-item"
                       key={'backNavigation'}
                       style={{position: 'relative'}}
                       onClick={this.handleChangeBackCatalog}>
                        <span>{groupNameBack}</span>
                        <span className="badge" style={{backgroundColor: '#fff', color: '#555'}}>
                            <span className="fa fa-reply"></span>
                        </span>

                    </a>
            );
        }
        if(generatorGroup){
            if(generatorGroup.catalogs && generatorGroup.catalogs.length > 0){
                generatorGroup.catalogs.forEach( (catalog, index) => {
                    generatorGroupCatalogs.push(
                            <a href="#"
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
                            </a>
                    );
                });
            }
            if(generatorGroup.files && generatorGroup.files.length > 0){
                generatorGroup.files.forEach( (generator, index) => {
                    generatorItems.push(
                        <a href="#"
                           className="list-group-item"
                           key={'generator' + generator.config.name + index}
                           style={{position: 'relative'}}
                           data-generator-file={generator.filePath}
                           onClick={this.handleSubmitStep}>
                            <span>{generator.config.description}</span>
                        </a>
                    );
                });
            }
        }
        return (
            <div style={this.props.formStyle}>
                <h5 className='text-center'>
                    <small>{'Category: '}</small>
                    <span>{groupKey}</span>
                </h5>
                <table style={{width: '100%'}}>
                    <tbody>
                    <tr>
                        <td style={{width: '20em', verticalAlign: 'top', padding: '0 .5em 0 0'}}>
                            <div style={{height: '22em', width: '100%', overflow: 'auto'}}>
                                <div className="list-group">
                                    {headGroupItems}
                                    <div className="list-group-item active">{groupName}</div>
                                    {generatorGroupCatalogs}
                                </div>
                            </div>
                        </td>
                        <td style={{verticalAlign: 'top'}}>
                            <div style={{height: '22em', width: '100%', overflow: 'auto'}}>
                                <div className="list-group">
                                    {generatorItems}
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div style={{display: 'table', textAlign: 'center', width: '100%', marginTop: '2em'}}>
                    <Button bsStyle='default' onClick={this.handleBackStep}>Back</Button>
                    <span>&nbsp;</span>
                    <span>&nbsp;</span>
                    <a href="#" onClick={this.handleInstallAdditional}>Install additional generators</a>
                </div>
            </div>
        );
    }

}

export default FormGeneratorList;
