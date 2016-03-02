import React, { Component, PropTypes } from 'react';

class CheckboxStateful extends Component {

    constructor(props, content) {
        super(props, content);
        this.state = {
            value: this.props.value
        };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            value: nextProps.value
        });
    }
    handleOnChange() {
        this.setState({
            value: this.refs.inputElement.checked
        });
    }
    getValue(){
        return this.state.value;
    }
    render() {
        const {value} = this.state;
        return (
            <input
                {...this.props}
                ref="inputElement"
                type="checkbox"
                checked={value}
                onChange={ this.handleOnChange }/>
        );
    }
}
CheckboxStateful.defaultProps = {
    value: false
};
CheckboxStateful.propTypes = {
    value: PropTypes.bool
};

export default CheckboxStateful;
