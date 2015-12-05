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

    //if( type === DeskPageActions.DISCARD_CLIPBOARD
    //    || type === DeskPageActions.PASTE_DELETE_IN_MODEL_FROM_CLIPBOARD
    //    || type === DeskPageActions.SELECT_AVAILABLE_COMPONENT
    //    || type === DeskPageActions.SWITCH_PAGE_TO_INDEX ){
    //
    //    const umyIdToCopy = store.getState()['deskPage']['selectedUmyIdToCopy'];
    //    if(umyIdToCopy){
    //        const DOMNode = UtilStore.getPageDomNode(umyIdToCopy);
    //        if(DOMNode){
    //            $(DOMNode).removeClass('umy-grid-basic-border-copy');
    //            //console.log('[Middleware] removed copy border: %o %o', umyIdToCopy, DOMNode);
    //        }
    //    }
    //
    //    const umyIdToCut = store.getState()['deskPage']['selectedUmyIdToCut'];
    //    if(umyIdToCut){
    //        const DOMNode = UtilStore.getPageDomNode(umyIdToCut);
    //        if(DOMNode){
    //            $(DOMNode).removeClass('umy-grid-basic-border-cut');
    //        }
    //    }
    //
    //}


    //if(action.type === DeskPageActions.COMPONENT_WAS_CLICKED
    //    || action.type === DeskPageActions.SELECT_AVAILABLE_COMPONENT){
    //
    //    const { umyId } = action.payload;
    //    let selectedUmyId = umyId ? umyId : store.getState()['deskPage']['selectedUmyId'];
    //    let searchResult = null;
    //    let isNodeInCurrentPage = false;
    //    console.log('Create overlay for umyId: ' + selectedUmyId);
    //    if(selectedUmyId){
    //        let model = store.getState()['deskPage']['model'];
    //        searchResult = Utils.findByUmyId(model, selectedUmyId);
    //        const frameWindow = UtilStore.getFrameWindow();
    //        const DOMNode = UtilStore.getPageDomNode(selectedUmyId);
    //        if(frameWindow && DOMNode && searchResult){
    //
    //            let plugin = null;
    //            if(action.type === createComponentOverlay(
    //                store, frameWindow, selectedUmyId, searchResult.found.type, {exProps: searchResult.foundProp}
    //            );
    //            plugin.append(DOMNode);
    //            UtilStore.setCurrentOverlayPlugin(plugin);
    //            isNodeInCurrentPage = true;
    //        }
    //    }
    //    action.payload.umyId = selectedUmyId;
    //    action.payload.searchResult = searchResult;
    //    action.payload.isDomNodeInCurrentPage = isNodeInCurrentPage;
    //
    //} else if(action.type === DeskPageActions.DISCARD_COMPONENT_SELECTION){
    //    UtilStore.destroyCurrentOverlayPlugin();
    //}

    return next(action);
}
