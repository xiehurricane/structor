import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as DeskPageActions from '../../actions/deskPageActions.js';

class ToolbarBreadcrumbs extends Component {

    constructor(props) {
        super(props);
        this.handleClickCrumb = this.handleClickCrumb.bind(this);
    }

    handleClickCrumb(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.setComponentSelection(e.currentTarget.attributes['data-umyid'].value);
    }

    render() {

        const { selectedUmyId, isDomNodeInCurrentPage, searchResult } = this.props;

        let crumbs = [];
        let children = [];
        let active = 'Nothing is selected';
        if(selectedUmyId && isDomNodeInCurrentPage && searchResult){
            active = searchResult.found.type;
            if(searchResult.parentList && searchResult.parentList.length > 0){
                searchResult.parentList.forEach( (parent, index) => {
                    if(parent && parent.type){
                        crumbs.push(
                            <li key={'crumb' + index}>
                                <a href="#" onClick={this.handleClickCrumb} data-umyid={parent.props['data-umyid']}>{parent.type}</a>
                            </li>
                        );

                    }
                });
            }

            if(searchResult.found.children && searchResult.found.children.length > 0){
                searchResult.found.children.forEach( (child, index) => {
                    children.push(
                        <li key={'child' + index}>
                            <a href="#" onClick={this.handleClickCrumb} data-umyid={child.props['data-umyid']}>{child.type}</a>
                        </li>
                    );
                });
            }
        }
        let dropdownClassName = crumbs.length >= 3 ? ' dropdown-menu-right' : '';
        if(children.length > 0){
            crumbs.push(
                <li key={'crumbActive'} className='dropdown'>
                    <a href='#' className='dropdown-toggle' data-toggle='dropdown'>
                        {active}
                        &nbsp;<span className='caret'></span>
                    </a>
                    <ul className={"dropdown-menu" + dropdownClassName} role="menu" style={{overflowY: 'auto', maxHeight: '200px'}}>
                        {children}
                    </ul>
                </li>
            );
        } else {
            crumbs.push(
                <li key={'crumbActive'}>{active}</li>
            );
        }
        return (
            <div {...this.props}>
                <ol className='breadcrumb'>
                    {crumbs}
                </ol>
            </div>
        );
    }

}

function mapStateToProps(state) {
    const { deskPage } = state;
    return {
        selectedUmyId: deskPage.selectedUmyId,
        searchResult: deskPage.searchResult,
        isDomNodeInCurrentPage: deskPage.isDomNodeInCurrentPage
    };
}

export default connect(
    mapStateToProps,
    {
        setComponentSelection: DeskPageActions.setComponentSelection
    }
)(ToolbarBreadcrumbs);
