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

import * as ModalComponentGeneratorActions from '../../actions/modalComponentGeneratorActions.js';

import FormComponentName from './FormComponentName.js';
import FormGeneratorList from './FormGeneratorList.js';
import FormGeneratorMetaInfo from './FormGeneratorMetaInfo.js';
import FormGeneratedSourceCode from './FormGeneratedSourceCode.js';

class WizardGenerateComponent extends Component {

    componentDidMount(){
        this.props.startStep0();
    }

    render(){

        let stepComponent = null;
        const formStyle={
            marginTop: '2em'
        };
        switch(this.props.step) {
            case 0:
                stepComponent = (
                    <FormComponentName
                        formStyle={formStyle}
                        groupNames={this.props.groupNames}
                        groupName={this.props.groupName}
                        componentName={this.props.componentName}
                        onSubmitStep={this.props.submitStep0}/>
                );
                break;
            case 1:
                stepComponent = (
                    <FormGeneratorList
                        formStyle={formStyle}
                        generatorList={this.props.generatorList}
                        onBackStep={this.props.startStep0}
                        onSubmitStep={this.props.submitStep1}/>
                );
                break;
            case 2:
                stepComponent = (
                    <FormGeneratorMetaInfo
                        formStyle={formStyle}
                        metaModel={this.props.metaModel}
                        metaHelp={this.props.metaHelp}
                        onBackStep={this.props.startStep1}
                        onSubmitStep={this.props.submitStep2}/>
                );
                break;
            case 3:
                stepComponent = (
                    <FormGeneratedSourceCode
                        formStyle={formStyle}
                        componentSourceDataObject={this.props.componentSourceDataObject}
                        onBackStep={this.props.startStep2}
                        onSubmitStep={this.props.submitStep3}/>
                );
                break;
            default:
                break;
        }
        return (
            <div style={{width: '100%'}}>
                <h4 className='text-center'>Generate Component's source code</h4>
                {stepComponent}
            </div>
        );
    }

}


function mapStateToProps(state) {
    return state.modalComponentGenerator;
}

//function mapDispatchToProps(dispatch) {
//    return {
//        //onIncrement: () => dispatch(increment())
//    };
//}

export default connect(
    mapStateToProps,
    ModalComponentGeneratorActions
)(WizardGenerateComponent);

