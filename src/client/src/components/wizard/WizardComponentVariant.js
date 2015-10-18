import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


import * as ModalComponentVariantActions from '../../actions/modalComponentVariantActions.js';

import FormComponentVariantName from './FormComponentVariantName.js';
import FormMessage from './FormMessage.js';

class WizardComponentVariant extends Component {

    componentDidMount(){
        this.props.startStep0();
    }

    render(){

        let stepComponent = null;
        const formStyle={
            marginTop: '2em',
            height: '200px'
        };
        switch(this.props.step) {
            case 0:
                stepComponent = (
                    <FormComponentVariantName
                        formStyle={formStyle}
                        onSubmitStep={this.props.submitStep0}/>
                );
                break;
            case 1:
                stepComponent = (
                    <FormMessage
                        formStyle={formStyle}
                        message={'Component variant was saved successfully.'} />
                );
                break;
            default:
                break;
        }
        return (
            <div style={{width: '100%'}}>
                <h4 className='text-center'>New component variant</h4>
                {stepComponent}
            </div>
        );
    }

}


function mapStateToProps(state) {
    return state.modalComponentVariant;
}

//function mapDispatchToProps(dispatch) {
//    return {
//        //onIncrement: () => dispatch(increment())
//    };
//}

export default connect(
    mapStateToProps,
    ModalComponentVariantActions
)(WizardComponentVariant);

