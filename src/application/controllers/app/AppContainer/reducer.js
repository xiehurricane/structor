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

import * as actions from './actions.js';

const initialState = {
    fetch: {
        status: 'done',
        error: null
    },
    packageConfig: {},
    projectDirectoryStatus: null
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;
    switch (type) {
        case actions.GET_PROJECT_INFO:
            return Object.assign({}, state, {
                fetch: {
                    status: 'start',
                    error: null
                }
            });
        case actions.GET_PROJECT_INFO_DONE:
            return Object.assign({}, state, {
                fetch: {
                    status: 'done',
                    error: null
                },
                packageConfig: payload.packageConfig,
                projectDirectoryStatus: payload.projectDirectoryStatus
            });
        case actions.GET_PROJECT_INFO_FAIL:
            return Object.assign({}, state, {
                fetch: {
                    status: 'error',
                    error: String(payload)
                }
            });
        default:
            return state
    }
}

