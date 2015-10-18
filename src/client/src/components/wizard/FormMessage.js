import React, { Component, PropTypes } from 'react';

import {
    Button
} from 'react-bootstrap';

class FormMessage extends Component {

    constructor(props) {
        super(props);
    }

    handleBackStep(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onBackStep) {
            this.props.onBackStep();
        }
    }

    handleSubmitStep(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onSubmitStep) {
            this.props.onSubmitStep();
        }
    }

    render() {
        return (
            <div style={this.props.formStyle}>
                <table style={{width: '100%'}}>
                    <tbody>
                    <tr>
                        <td style={{width: '20%'}}></td>
                        <td style={{height: '100%', verticalAlign: 'middle'}}>
                            <p>{this.props.message}</p>
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
                    {/*<Button bsStyle='primary' onClick={this.handleSubmitStep}>Next</Button>*/}
                </div>
            </div>
        );
    }

}

export default FormMessage;
