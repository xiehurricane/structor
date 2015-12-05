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
import { ListGroupItem } from 'react-bootstrap';

import * as DeskPageActions from '../../actions/deskPageActions.js';
import * as ServerActions from '../../actions/serverActions.js';

import CollapsibleLabel from '../element/CollapsibleLabel.js';

class PanelAvailableComponentItem extends Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.handleDefaultIndexSelect = this.handleDefaultIndexSelect.bind(this);
    }

    handleClick(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.invokeServerApi(
            'loadComponentDefaults',
            {componentName: this.props.componentName},
            [DeskPageActions.SELECT_AVAILABLE_COMPONENT],
            {componentName: this.props.componentName},
            true
        );
    }

    handlePreview(e){
        e.preventDefault();
        e.stopPropagation();

        const index = parseInt(e.currentTarget.attributes['data-index'].value);
        this.props.showAvailableComponentPreview(index);

    }

    handleDefaultIndexSelect(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.setAvailableComponentDefaultIndex(parseInt(e.currentTarget.attributes['data-index'].value));
    }
    //
    //componentWillUpdate(nextProps, nextState){
    //    PopoverComponentVariantActions.hide();
    //}

    render(){

        const {
            componentName,
            selectedAvailableComponentName,
            selectedAvailableComponentDefaults,
            defaultsIndexMap
            } = this.props;

        if(selectedAvailableComponentName === componentName){

            let variantList = null;
            let variantName = null;
            const defaults = selectedAvailableComponentDefaults;
            const defaultsIndex = defaultsIndexMap[selectedAvailableComponentName] || 0;
            if(defaults && defaults.length > 0){

                let variantListItems = [];
                let defaultItemClass = '';
                let labelElement = null;
                defaults.forEach( (variant, index) => {
                    let label = variant.variantName ? variant.variantName : ('Variant #' + index);
                    if(index === defaultsIndex){
                        defaultItemClass = 'text-primary';
                        labelElement = (
                            <strong>{label}</strong>
                        );
                        variantName = label;
                    } else {
                        defaultItemClass = 'text-muted';
                        labelElement = (
                            <span>{label}</span>
                        );
                    }
                    variantListItems.push(
                        <li key={'variantListItem' + index} ref={'variantListItem' + index} style={{position: 'relative'}} className={defaultItemClass}>
                            <p onClick={this.handleDefaultIndexSelect}
                               style={{cursor: 'pointer', margin: '0', padding: '3px', width: 'calc(100% - 2em)'}}
                               data-index={index}>
                                {labelElement}
                            </p>
                            <div style={{position: "absolute", padding: "2px", top: "0", right: "0.3em", cursor: 'pointer', width: '1.5em', height: '1.5em'}}
                                 onClick={this.handlePreview}
                                 data-index={index}>
                                <span className='fa fa-external-link'></span>
                            </div>
                        </li>
                    );
                });
                variantList = (
                    <ul className='list-unstyled'>
                        {variantListItems}
                    </ul>
                );
            }
            let titleComponentName = componentName;
            if(titleComponentName.length > 13){
                titleComponentName = titleComponentName.substr(0, 13) + '...';
            }
            return (
                <li className="list-group-item" >
                    <h4 className="list-group-item-heading">{titleComponentName}</h4>
                    <hr style={{marginTop: '0', marginBottom: '0'}}/>
                    <p>{variantName}</p>
                    {/*variantSelectorElement*/}
                    <CollapsibleLabel title='More variants ...' onToggle={function(){}}>
                        {variantList}
                    </CollapsibleLabel>
                </li>
            );
        } else {
            let titleComponentName = componentName;
            if(titleComponentName.length > 20){
                titleComponentName = titleComponentName.substr(0, 20) + '...';
            }
            return (
                <a className="list-group-item" href="#" onClick={this.handleClick}>
                    <span>{titleComponentName}</span>
                </a>
            );
        }
    }

}


function mapStateToProps(state) {
    const { deskPage } = state;
    return {
        selectedAvailableComponentName: deskPage.selectedAvailableComponentName,
        selectedAvailableComponentDefaults: deskPage.selectedAvailableComponentDefaults,
        defaultsIndexMap: deskPage.defaultsIndexMap
    };
}

export default connect(
    mapStateToProps,
    {
        invokeServerApi: ServerActions.invoke,
        showAvailableComponentPreview: DeskPageActions.showAvailableComponentPreview,
        setAvailableComponentDefaultIndex: DeskPageActions.setAvailableComponentDefaultIndex
    }
)(PanelAvailableComponentItem);

