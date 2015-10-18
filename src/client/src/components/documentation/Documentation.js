import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Panel, Button, Nav, CollapsibleNav,
    Navbar, DropdownButton, MenuItem, NavItem } from 'react-bootstrap';

import FormDocument from './FormDocument.js';

class Documentation extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div>
                <FormDocument />
            </div>
        )

    }

}

export default Documentation;

