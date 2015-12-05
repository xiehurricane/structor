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
import { Grid, Row, Col, Panel, Button, Nav, CollapsibleNav,
    Navbar, DropdownButton, MenuItem, NavItem } from 'react-bootstrap';
import * as ServerActions from '../../actions/serverActions.js';

class FormStart extends Component {

    constructor(props) {
        super(props);
        this.handleRecheckClick = this.handleRecheckClick.bind(this);
        //this.handleLogout = this.handleLogout.bind(this);
        //this.handleLogin = this.handleLogin.bind(this);
    }

    handleRecheckClick(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.invokeServerApi('checkProjectDir', {}, [ServerActions.DATA_PROJECT_DIR_STATUS]);
    }

    render(){
        return (
            <Grid fluent={true}>
                <Row style={{marginTop: '70px'}}>
                    <Col xs={10} md={8} sm={10} lg={6} xsOffset={1} mdOffset={2} smOffset={1} lgOffset={3}>
                        {alert}
                        <Panel>
                            <h4 className="text-center text-primary">Apparently, there are some issues with project directory, look at the error message.</h4>
                            <h4 className="text-center text-primary">If you don't understand the cause of the error please write to <a href="mailto:support@helmetrex.com">Structor Support</a></h4>
                            <Button bsStyle={ 'default'} block={true} onClick={this.handleRecheckClick}>
                                <span>Recheck current directory</span>
                            </Button>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );

    }

}

function mapStateToProps(state) {
    const { application, server } = state;
    return {
        //stage: application.get('stage'),
        //packageVersion: server.get('packageVersion'),
        //userName: server.getIn(['userProfile', 'userName']),
        //projectDirectoryStatus: server.get('projectDirectoryStatus')
    };
}

export default connect(
    mapStateToProps,
    {
        invokeServerApi: ServerActions.invoke
    }
)(FormStart);
