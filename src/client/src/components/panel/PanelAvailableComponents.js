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
import { Button, Input } from 'react-bootstrap';

import PanelAvailableComponentItem from './PanelAvailableComponentItem.js';

class PanelAvailableComponents extends Component {

    constructor(props) {
        super(props);
        this.state = { filer: '' };
        this.handleChangeFind = this.handleChangeFind.bind(this);
        this.handleClearFind = this.handleClearFind.bind(this);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    }

    componentDidMount() {
        //$(React.findDOMNode(this)).find('.panel-body').remove();
    }

    componentDidUpdate() {
        //$(React.findDOMNode(this)).find('.panel-body').remove();
    }

    componentWillUpdate(nextProps, nextState) {
        //PopoverComponentVariantActions.hide();
    }

    componentWillUnmount() {
    }

    handleChangeFind(e) {
        var value = this.refs.inputElement.value;
        var newState = {
            filter: value
        };
        this.setState(newState);
    }

    handleOnKeyDown(e) {
        if (e.keyCode == 27) {
            this.handleClearFind(e);
        }
    }

    handleClearFind(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({filter: ''});
    }

    render() {
        let style = {
            position: 'relative',
            width: '100%',
            marginTop: '5px'
        };

        let componentTreeModel = this.props.componentsTree;
        let libGroups = [];
        let groupHeaderKey = 0;
        let counter = 0;
        let _filter = this.state.filter ? this.state.filter.toUpperCase() : null;
        _.forOwn(componentTreeModel, (group, groupName) => {
            if(_.isObject(group)){
                let components = [];
                _.forOwn(group, (componentTypeValue, componentName) => {
                    if(_filter){
                        if(componentName.toUpperCase().startsWith(_filter)){
                            components.push(
                                <PanelAvailableComponentItem
                                    key={'item' + componentName + counter}
                                    componentName={componentName} />
                            );
                        }
                    } else {
                        components.push(
                            <PanelAvailableComponentItem
                                key={'item' + componentName + counter}
                                componentName={componentName} />
                        );

                    }

                });
                let key = '' + ++groupHeaderKey;
                if(components.length > 0){
                    let keySuffix = _filter ? '12' : '0';
                    let id = 'group' + groupName + counter + keySuffix;
                    let collapsed = !!_filter ? "in" : "";
                    libGroups.push(
                        <div className="panel panel-default" key={key}>
                            <div className="panel-heading" role="tab" id="headingOne">
                                <a style={{outline: '0'}} role="button" data-toggle="collapse" href={'#' + id} aria-expanded="true" aria-controls={id}>
                                    {groupName}
                                </a>
                            </div>
                            <div id={id} className={"panel-collapse collapse " + collapsed} role="tabpanel" aria-labelledby={id}>
                                <div className="list-group">
                                    {components}
                                </div>
                                <div style={{height: '0'}}></div>
                            </div>
                        </div>
                    );
                }
            }
            counter++;
        });

        return (
            <div style={{paddingTop: '5px'}}>
                <div className="input-group input-group-sm">
                    <input
                        ref='inputElement'
                        type="text"
                        className="form-control"
                        placeholder="Filter..."
                        value={this.state.filter}
                        onKeyDown={this.handleOnKeyDown}
                        onChange={this.handleChangeFind} />
                    <span className="input-group-btn">
                        <button
                            className="btn btn-default"
                            type="button"
                            onClick={this.handleClearFind}>
                            <span className='fa fa-times'></span>
                        </button>
                    </span>
                </div>
                <div ref='container' style={style}>
                    <div
                        className="panel-group"
                        id="accordion"
                        role="tablist"
                        aria-multiselectable="true"
                        ref="panelGroup">
                        {libGroups}
                    </div>
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    const { deskPage } = state;
    return {
        componentsTree: deskPage.componentsTree
    };
}

export default connect(
    mapStateToProps
)(PanelAvailableComponents);
