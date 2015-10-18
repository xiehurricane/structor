import React, { Component, PropTypes } from 'react';

import validator from 'validator';

import {
    Modal, Input, ListGroup, ListGroupItem,
    Badge, PanelGroup, TabbedArea, TabPane,
    Grid, Row, Col, Panel, Button, Nav,
    CollapsibleNav, Navbar, DropdownButton,
    MenuItem, NavItem
} from 'react-bootstrap';

import AceEditor from '../element/AceEditor.js';

class FormPropsComponentEditor extends Component {

    constructor(props) {
        super(props);
        this.handleCreateVariantName = this.handleCreateVariantName.bind(this);
        this.getPropsScript = this.getPropsScript.bind(this);
    }


    getPropsScript(){
        return this.refs.editor.getSourceCode();
    }

    handleCreateVariantName(e) {
        e.stopPropagation();
        e.preventDefault();
        //FormPropsComponentEditorActions.startWizardSaveVariant({
        //    propsScript: this.getPropsScript()
        //});
    }

    render(){

        let editorElement = null;
        let toolBarElement = null;

        if (this.props.wizard === 'SaveVariant') {

            toolBarElement = (
                <Row style={{marginBottom: '3px'}}>
                    <Col xs={12}>
                        <h4 className='text-center'></h4>
                    </Col>
                </Row>
            );
            //editorElement = (
            //    <WizardVariantName
            //        componentName={this.props.componentName}
            //        selectedUmyId={this.props.selectedUmyId}
            //        style={this.props.editorStyle}
            //        propsScript={this.props.propsScript} />
            //);

        } else {
            toolBarElement = (
                <Row style={{marginBottom: '3px'}}>
                    <Col xs={12}>
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <div className="dropdown">
                                        <button className="btn btn-default btn-xs dropdown-toggle" type="button"
                                                id="dropdownMenu" data-toggle="dropdown" aria-expanded="true">
                                            <span className="fa fa-gear fa-fw"></span>
                                            <span className="fa fa-caret-down fa-fw"></span>
                                        </button>
                                        <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
                                            <li role="presentation">
                                                <a role="menuitem" href="#" onClick={this.handleCreateVariantName}>
                                                    Save as new variant for component
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                                <td>
                                    <p style={{marginLeft: "1em"}}>
                                        {/*<span>{todo - variant name}</span>*/}
                                    </p>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            );
            editorElement = (
                <AceEditor ref='editor'
                           sourceName='componentPropsScript'
                           style={this.props.editorStyle}
                           sourceCode={this.props.propsScript}/>
            );
        }
        return (
            <Grid style={this.props.style} fluent={true}>
                {toolBarElement}
                <Row>
                    <Col xs={12}>
                        {editorElement}
                    </Col>
                </Row>
            </Grid>
        );

    }

}

FormPropsComponentEditor.defaultProps = {

};

export default FormPropsComponentEditor;
