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

import validator from 'validator';

import {
    Button
} from 'react-bootstrap';

class FormComponentName extends Component {

    constructor(props) {
        super(props);
        this.state = {
            groupName: props.groupName,
            componentName: props.componentName
        };
        this.handleClickGroupName = this.handleClickGroupName.bind(this);
        this.handleClickComponentName = this.handleClickComponentName.bind(this);
        this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
        this.handleGroupNameSelected = this.handleGroupNameSelected.bind(this);
        this.validationStateGroupName = this.validationStateGroupName.bind(this);
        this.validationStateComponentName = this.validationStateComponentName.bind(this);
        this.handleComponentNameChange = this.handleComponentNameChange.bind(this);
        this.handleBackStep = this.handleBackStep.bind(this);
        this.handleSubmitStep = this.handleSubmitStep.bind(this);
    }

    handleClickGroupName(){
        this.refs.groupNameInput.focus();
    }

    handleClickComponentName(){
        this.refs.componentNameInput.focus();
    }

    handleGroupNameChange() {
        var groupName = this.refs.groupNameInput.value;
        var newState = {
            groupName: groupName
        };
        this.setState(newState);
    }

    handleGroupNameSelected(e) {
        e.preventDefault();
        e.stopPropagation();
        var newState = {
            groupName: e.currentTarget.attributes['data-group'].value
        };
        this.setState(newState);
    }

    validationStateGroupName() {
        if (this.state.groupName
            && this.state.groupName.length > 0
            && validator.isAlphanumeric(this.state.groupName)) {
            //
            return 'has-success';
        }
        return 'has-error';
    }

    validationStateComponentName() {
        if (this.state.componentName
            && this.state.componentName.length > 0
            && validator.isAlphanumeric(this.state.componentName)) {
            //
            return 'has-success';
        }
        return 'has-error';
    }

    handleComponentNameChange() {
        var componentName = this.refs.componentNameInput.value;
        var newState = {
            componentName: componentName
        };
        this.setState(newState);
    }


    handleBackStep(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onBackStep) {
            this.props.onBackStep(this.getOptions());
        }
    }

    handleSubmitStep(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onSubmitStep) {
            this.props.onSubmitStep(this.getOptions());
        }
    }

    getOptions() {
        return {
            groupName: this.refs.groupNameInput.value,
            componentName: this.refs.componentNameInput.value
        }
    }

    componentDidMount() {
        this.refs.groupNameInput.focus();
    }

    componentWillUnmount() {
    }

    render() {
        let groupItems = [];
        let groups = this.props.groupNames || [];
        if (groups && groups.length > 0) {
            for (let i = 0; i < groups.length; i++) {
                if (groups[i] !== 'Html') {
                    groupItems.push(
                        <li key={i}>
                            <a href="#" onClick={this.handleGroupNameSelected} data-group={groups[i]}>
                                <span>{groups[i]}</span>
                            </a>
                        </li>
                    );
                }
            }
        }
        return (
            <div style={this.props.formStyle}>
                <h5 className='text-center'>Enter group and name</h5>
                <table style={{width: '100%'}}>
                    <tbody>
                    <tr>
                        <td style={{width: '20%'}}></td>
                        <td style={{height: '100%', verticalAlign: 'middle'}}>
                            <div className={'form-group ' + this.validationStateGroupName()}>
                                <label htmlFor='groupNameElement'>Group:</label>

                                <div className="input-group input-group-sm">
                                    <input id='groupNameElement'
                                           ref='groupNameInput'
                                           type="text"
                                           className="form-control"
                                           placeholder='Group name'
                                           value={this.state.groupName}
                                           onChange={this.handleGroupNameChange}
                                           onClick={this.handleClickGroupName}
                                        />

                                    <div className="input-group-btn">
                                        <button type="button"
                                                className="btn dropdown-toggle" data-toggle="dropdown"
                                                aria-expanded="false">
                                            <span className="caret"></span>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-right" role="menu">
                                            {groupItems}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className={'form-group ' + this.validationStateComponentName()}>
                                <label htmlFor='componentNameElement'>Component:</label>
                                <input id='componentNameElement'
                                       ref='componentNameInput'
                                       className="form-control input-sm"
                                       type="text"
                                       placeholder='Component name'
                                       value={this.state.componentName}
                                       onChange={this.handleComponentNameChange}
                                       onClick={this.handleClickComponentName}
                                    />
                            </div>
                        </td>
                        <td style={{width: '20%'}}></td>
                    </tr>
                    <tr>
                        <td colSpan='3'></td>
                    </tr>
                    </tbody>
                </table>
                <div style={{display: 'table', textAlign: 'center', width: '100%', marginTop: '2em'}}>
                    {/*<Button bsStyle='default' onClick={this._handleBackStep}>Back</Button>*/}
                    <Button bsStyle='primary' onClick={this.handleSubmitStep}>Next</Button>
                </div>
            </div>
        );
    }

}

export default FormComponentName;
