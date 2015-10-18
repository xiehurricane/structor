import React, { Component, PropTypes } from 'react';
import { Input, Button } from 'react-bootstrap';

class ProxyInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            urlValue: this.props.urlValue
        };
        this.handleClearUrlValue = this.handleClearUrlValue.bind(this);
        this.handleChangeUrlValue = this.handleChangeUrlValue.bind(this);
    }

    getUrlValue(){
        return this.refs.inputElement.getValue();
    }
    
    handleClearUrlValue(e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            urlValue: ''
        });
    }
    
    handleChangeUrlValue(e){
        this.setState({
            urlValue: this.refs.inputElement.getValue()
        });
    }

    render() {
        return (
            <Input 
                ref="inputElement"
                value={this.state.urlValue}
                type="text"
                label={ this.props.label} 
                placeholder="Enter value"
                addonBefore="URL:"
                onChange={this.handleChangeUrlValue}
                buttonAfter={ <Button 
                                onClick={this.handleClearUrlValue}
                                bsStyle="default">
                                <span className={ 'fa fa-times'}></span>
                              </Button> 
                }>
            </Input>
        );
    }

}

export default ProxyInput;
