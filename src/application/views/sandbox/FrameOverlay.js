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

class FrameOverlay extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.show) {
            return (
                <div style={{position: 'fixed', top: '0px', left: '0px', right: '0px', bottom: '0px', zIndex: '9999', backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
                        {this.props.children}
                    </div>
                </div>
            );
        } else {
            return (
                <span style={{display: 'none'}}></span>
            );
        }
    }
}

FrameOverlay.defaultProps = {
    show: false
};
FrameOverlay.propTypes = {
    show: PropTypes.bool
};

export default FrameOverlay;
