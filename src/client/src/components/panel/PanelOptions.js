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

import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Panel, PanelGroup } from 'react-bootstrap';

import OptionInput from '../element/OptionInput.js';
import CollapsiblePlusOptionInput from '../element/CollapsiblePlusOptionInput.js';

import * as DeskPageActions from '../../actions/deskPageActions.js';
import * as Utils from '../../api/utils.js';

class PanelOptions extends Component {

    constructor(props) {
        super(props);
        //this.state = {};
        this.handleAddNewProp = this.handleAddNewProp.bind(this);
    }

    handleAddNewProp(options){
        if(options.path && /^[a-zA-Z0-9.]+$/.test(options.path)){
            let valueObject = {};
            if(/^[0-9.]+$/.test(options.value)){
                _.set(valueObject, options.path, parseFloat(options.value));
            } else if(options.value === "true"){
                _.set(valueObject, options.path, true);
            } else if(options.value === "false"){
                _.set(valueObject, options.path, false);
            } else {
                _.set(valueObject, options.path, '' + options.value);
            }
            this.props.changeModelNodeOptions(valueObject);
        }
    }

    render() {
        let style = {
            width: '100%',
            paddingTop: '5px',
            paddingRight: '5px',
            paddingLeft: '5px',
            paddingBottom: '10px',
            border: '1px solid #DBDBDB',
            borderRadius: '3px'
        };
        let panelContent = null;
        const { selectedUmyId, isDomNodeInCurrentPage, searchResult } = this.props;
        if(selectedUmyId && isDomNodeInCurrentPage && searchResult && searchResult.found){

            let optionInputs = [];

            let modelNode = Utils.fulex(searchResult.found);
            Utils.cleanPropsUmyId(modelNode);
            let sanitizedProps = modelNode.props;

            _.forOwn(sanitizedProps, (value, prop) => {
                if(_.isObject(value)){
                    _.forOwn(value, (subValue, subProp) => {
                        if(!_.isObject(subValue)){
                            let valueObject = {};
                            let pathTo = prop + '.' + subProp;
                            _.set(valueObject, pathTo, subValue);
                            optionInputs.push(
                                <OptionInput
                                    key={pathTo + selectedUmyId}
                                    style={{marginTop: '0.5em', padding: '0 1em 0 1em'}}
                                    valueObject={valueObject}
                                    path={pathTo}
                                    onDeleteValue={this.props.deleteModelNodeOptionByPath}
                                    onSetFocus={this.props.setFocusedQuickOptionPath}
                                    onChangeValue={this.props.changeModelNodeOptions}/>
                            );
                        }
                    });
                } else {
                    let valueObject = {};
                    let pathTo = prop;
                    _.set(valueObject, pathTo, value);
                    optionInputs.push(
                        <OptionInput
                            key={pathTo + selectedUmyId}
                            style={{marginTop: '0.5em', padding: '0 1em 0 1em'}}
                            valueObject={valueObject}
                            path={pathTo}
                            onDeleteValue={this.props.deleteModelNodeOptionByPath}
                            onSetFocus={this.props.setFocusedQuickOptionPath}
                            onChangeValue={this.props.changeModelNodeOptions}/>
                    );
                }
            });

            panelContent = (
                <div style={style}>
                    <div style={{position: 'relative'}}>
                        <p className="text-center"><kbd>{'<' + Utils.trimComponentName(modelNode.type) + '>'}</kbd></p>
                        <div style={{width: '100%', overflow: 'auto'}}>
                            <p><span>Props:</span></p>
                            <pre style={{fontSize: '10px'}}>{JSON.stringify(sanitizedProps, null, 2)}</pre>
                        </div>
                        <CollapsiblePlusOptionInput
                            style={{width: '100%', zIndex: '1030'}}
                            onCommit={this.handleAddNewProp}/>
                    </div>
                    {optionInputs}
                </div>
            );
        } else {
            //<div style={{ padding: '0.5em 0.5em 1.5em 0.5em' }}>
            //
            //</div>
            panelContent = (
                <div style={style}>
                    <h4 className='text-center'>Nothing is selected</h4>
                </div>
            );
        }
        return panelContent;
    }

}

function mapStateToProps(state) {
    const { deskPage } = state;
    return {
        selectedUmyId: deskPage.selectedUmyId,
        searchResult: deskPage.searchResult,
        isDomNodeInCurrentPage: deskPage.isDomNodeInCurrentPage,
        focusedPathInProps: deskPage.quickOptions.focusedPathInProps
    };
}

export default connect(
    mapStateToProps,
    {
        setFocusedQuickOptionPath: DeskPageActions.setFocusedQuickOptionPath,
        changeModelNodeOptions: DeskPageActions.changeModelNodeOptions,
        deleteModelNodeOptionByPath: DeskPageActions.deleteModelNodeOptionByPath
    }
)(PanelOptions);
