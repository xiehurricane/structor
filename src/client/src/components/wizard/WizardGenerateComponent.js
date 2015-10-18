import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as ModalComponentGeneratorActions from '../../actions/modalComponentGeneratorActions.js';

import FormComponentName from './FormComponentName.js';
import FormGeneratorList from './FormGeneratorList.js';
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
                    <FormGeneratedSourceCode
                        formStyle={formStyle}
                        componentSourceDataObject={this.props.componentSourceDataObject}
                        onBackStep={this.props.startStep1}
                        onSubmitStep={this.props.submitStep2}/>
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

