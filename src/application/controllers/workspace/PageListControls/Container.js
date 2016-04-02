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
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';
import { CHANGE_OPTIONS } from '../PageOptionsModal/actions.js';

import { graphApi } from '../../../api/index.js';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {componentModel, deskPageModel, changePageRoute, showModal, deletePage} = this.props;
        const pages = deskPageModel.pages;
        let pagesList = [];
        let currentRoutePathLabel = deskPageModel.currentPagePath;
        if(pages && pages.length > 0){
            let indexRouteLabel = ' [IndexRoute]';
            pages.forEach( (page, index) => {
                let routePathLabel = page.pagePath;
                if(index === 0){
                    if(routePathLabel === deskPageModel.currentPagePath){
                        currentRoutePathLabel += indexRouteLabel;
                    }
                    routePathLabel += indexRouteLabel;
                }
                pagesList.push(
                    <li key={routePathLabel}>
                        <a onClick={
                                (e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    changePageRoute(page.pagePath);
                                }
                            } href="#">
                            {routePathLabel}
                        </a>
                    </li>
                );
            } );
        }
        return (
            <div  {...this.props} className="btn-group" role="group">
                <button
                    className="btn btn-default btn-xs"
                    onClick={(e) => {
                           e.stopPropagation();
                           e.preventDefault();
                           if(confirm('Are you sure you want to delete current page?')){
                             deletePage()
                           }
                        }
                    }
                    title="Delete current page">
                    <span className="fa fa-trash-o" ></span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); showModal(CHANGE_OPTIONS); }}
                    title="View page info">
                                        <span>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {currentRoutePathLabel}
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </span>
                </button>
                <div className="btn-group" role="group">
                    <button className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                        &nbsp;&nbsp;
                        <span className="caret"></span>
                        &nbsp;&nbsp;
                    </button>
                    <ul className="dropdown-menu" role="menu">
                        <li role="presentation" className="dropdown-header">Switch to:</li>
                        {pagesList}
                    </ul>
                </div>
            </div>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);
