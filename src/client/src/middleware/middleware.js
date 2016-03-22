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

import * as DeskPageActions from '../actions/deskPageActions.js';
import * as DeskActions from '../actions/deskActions.js';
import * as ServerActions from '../actions/serverActions.js';
import { createComponentOverlay } from '../api/overlays.js';
import * as UtilStore from '../api/utilStore.js';
import * as Utils from '../api/utils.js';

export default store => next => action => {
    //console.log(action);
    const { type } = action;

    if( type === DeskPageActions.CHANGE_MODEL_NODE_OPTIONS
        || type === DeskPageActions.DELETE_MODEL_NODE_OPTION_BY_PATH
        || type === DeskPageActions.PASTE_IN_MODEL_FROM_CLIPBOARD
        || type === DeskPageActions.DELETE_IN_MODEL_SELECTED
        || type === DeskPageActions.MOVE_IN_MODEL_SELECTED
        || type === DeskPageActions.PASTE_DELETE_IN_MODEL_FROM_CLIPBOARD
        || type === DeskPageActions.DUPLICATE_IN_MODEL_SELECTED
        || type === DeskPageActions.REWRITE_MODEL_NODE
        || type === DeskPageActions.QUICK_PASTE_IN_MODEL_BY_NAME
        || type === DeskPageActions.CHANGE_CURRENT_PAGE_INFO
        || type === DeskPageActions.ADD_NEW_PAGE
        || type === DeskPageActions.COPY_CURRENT_PAGE
        || type === DeskPageActions.DELETE_CURRENT_PAGE ){

        const { deskPage: { model } } = store.getState();

        let projectModel = UtilStore.removeMarksFromModel(Utils.fulex(model));

        UtilStore.pushUndoState(projectModel);

        store.dispatch(ServerActions.invokeSilently('saveProjectModel', { model: projectModel }));

    }

    return next(action);
}
