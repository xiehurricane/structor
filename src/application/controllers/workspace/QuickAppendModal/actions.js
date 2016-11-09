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

import { bindActionCreators } from 'redux';
import {quickBefore, quickAfter, quickFirst, quickLast, quickReplace} from '../LibraryPanel/actions.js';
import {setSelectedKeys} from '../SelectionBreadcrumbs/actions.js'

export const modeMap = {
    addBefore: {type: 'addBefore', label: 'Add before selected component'},
    addAfter: {type: 'addAfter', label: 'Add after selected component'},
    insertFirst: {type: 'insertAfter', label: 'Insert as first child in selected component'},
    insertLast: {type: 'insertLast', label: 'Insert as last child in selected component'},
    replace: {type: 'replace', label: 'Replace selected component'},
};

export const HIDE_MODAL = "QuickAppendModal/HIDE_MODAL";
export const SHOW_MODAL = "QuickAppendModal/SHOW_MODAL";
export const SUBMIT = "QuickAppendModal/SUBMIT";

export const hideModal = () => ({type: HIDE_MODAL});

export const showModal = (appendMode, targetKey)  => (dispatch, getState) => {
    if(targetKey){
        dispatch(setSelectedKeys([targetKey]));
    }
    dispatch({type: SHOW_MODAL, payload: appendMode});
};

export const submit = (componentTuple, appendMode) => (dispatch, getState) => {
    const componentNames = componentTuple.split('.');
    if(appendMode.type === modeMap.addBefore.type){
        dispatch(quickBefore(componentNames));
    } else if(appendMode.type === modeMap.addAfter.type){
        dispatch(quickAfter(componentNames));
    } else if(appendMode.type === modeMap.insertFirst.type){
        dispatch(quickFirst(componentNames));
    } else if(appendMode.type === modeMap.insertLast.type){
        dispatch(quickLast(componentNames));
    } else if(appendMode.type === modeMap.replace.type){
        dispatch(quickReplace(componentNames));
    }
    dispatch(hideModal());
};

export const containerActions = (dispatch) => bindActionCreators({
    hideModal, submit
}, dispatch);
