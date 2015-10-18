import React, { Component, PropTypes } from 'react';

import validator from 'validator';

import {
    Button
} from 'react-bootstrap';

class FormGeneratorList extends Component {

    constructor(props) {
        super(props);
        this.handleBackStep = this.handleBackStep.bind(this);
        this.handleSubmitStep = this.handleSubmitStep.bind(this);
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
            var generatorName = e.currentTarget.attributes['data-generator-name'].value;
            this.props.onSubmitStep({
                generatorName: generatorName
            });
        }
    }

    render() {
        let generatorItems = [];
        if(this.props.generatorList && this.props.generatorList.length > 0){
            this.props.generatorList.forEach( (generator, index) => {
                generatorItems.push(
                    <a className="list-group-item" href="#"
                       key={'generator' + generator.config.name + index}
                       style={{position: 'relative'}}
                       data-generator-name={generator.config.name}
                       onClick={this.handleSubmitStep}>
                        <span>{generator.config.description}</span>
                    </a>
                );
            });
        }
        return (
            <div style={this.props.formStyle}>
                <h5 className='text-center'>Select appropriate generators' pack</h5>
                <table style={{width: '100%'}}>
                    <tbody>
                    <tr>
                        <td style={{width: '20%'}}></td>
                        <td>
                            <div style={{ maxHeight: '22em', width: '100%', overflow: 'auto'}}>
                                <div className="list-group">
                                    {generatorItems}
                                </div>
                            </div>
                        </td>
                        <td style={{width: '20%'}}></td>
                    </tr>
                    </tbody>
                </table>
                <div style={{display: 'table', textAlign: 'center', width: '100%', marginTop: '2em'}}>
                    <Button bsStyle='default' onClick={this.handleBackStep}>Back</Button>
                </div>
            </div>
        );
    }

}

export default FormGeneratorList;
