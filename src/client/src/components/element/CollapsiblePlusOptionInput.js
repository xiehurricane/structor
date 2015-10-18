import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Collapse, Panel } from 'react-bootstrap';

class CollapsiblePlusOptionInput extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.handleToggle = this.handleToggle.bind(this);
        this.handleCommit = this.handleCommit.bind(this);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    }

    handleToggle(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.props.onToggle){
            this.props.onToggle();
        }
        this.setState({open: !this.state.open});
    }

    handleCommit(e){
        e.preventDefault();
        e.stopPropagation();
        this.handleToggle(e);
        if(this.props.onCommit){
            this.props.onCommit({
                path: this.refs.inputPath.value,
                value: this.refs.inputValue.value
            });
        }
    }


    handleOnKeyDown(e){
        if(e.keyCode == 27){
            this.handleToggle(e);
        } else if (e.keyCode == 13){
            this.handleCommit(e);
        }
    }

    componentDidUpdate(){
        if(this.state.open){
            this.refs.inputPath.focus();
        }
    }

    render(){

        let addInputStyle = {
            height: '1.55em',
            paddingTop: '2px',
            paddingBottom: '2px',
            marginBottom: '0.5em'
        };

        return (
            <div {...this.props}>
                <div style={{ display: 'table', width: '100%' }}>
                    <div style={{ display: 'table-row' }}>
                        <div style={{ display: 'table-cell', textAlign: 'center'}}>
                            <button
                                role='button'
                                className='btn btn-default btn-xs' onClick={this.handleToggle}>
                                <span className='fa fa-plus'></span>
                            </button>
                        </div>
                    </div>
                </div>

                <Collapse in={this.state.open}>
                    <div style={{position: 'relative'}}>
                        <Panel>
                            <p>Property path</p>
                            <input ref="inputPath"
                                   placeholder="prop[.prop]"
                                   type="text"
                                   className="form-control"
                                   style={addInputStyle}
                                   onKeyDown={this.handleOnKeyDown}/>
                            <p>Property value</p>
                            <input ref="inputValue"
                                   type="text"
                                   className="form-control"
                                   style={addInputStyle}
                                   onKeyDown={this.handleOnKeyDown}/>
                            <button
                                role='button'
                                className='btn btn-default btn-xs btn-block'
                                onClick={this.handleCommit}>
                                <span>Add</span>
                            </button>
                        </Panel>
                    </div>
                </Collapse>
            </div>
        );
    }

}

CollapsiblePlusOptionInput.defaultProps = {
    onToggle: null
};

export default CollapsiblePlusOptionInput;


