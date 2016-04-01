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
import { graphApi } from '../../../api';
import { updateMarked, updatePage } from '../DeskPage/actions.js';
import { removeSelectedKeys, setSelectedKeys } from '../SelectionBreadcrumbs/actions.js';

export const CLIPBOARD_EMPTY = 'Empty';
export const CLIPBOARD_NEW = 'New';
export const CLIPBOARD_COPY = 'Copy';
export const CLIPBOARD_CUT = 'Cut';

export const RESET_KEYS = "ClipboardControls/RESET_KEYS";

export const setForCuttingKeys = (keys) => (dispatch, getState) => {
    dispatch(removeClipboardKeys());
    let newKeys = [];
    if(keys && keys.length > 0){
        keys.forEach(key => {
            graphApi.setForCutting(key);
            newKeys.push(key);
        });
    }
    dispatch(removeSelectedKeys());
    dispatch({type: RESET_KEYS, payload: {keys: newKeys, mode: CLIPBOARD_CUT}});
};

export const setForCopyingKeys = (keys) => (dispatch, getState) => {
    dispatch(removeClipboardKeys());
    let newKeys = [];
    if(keys && keys.length > 0){
        keys.forEach(key => {
            graphApi.setForCopying(key);
            newKeys.push(key);
        });
    }
    dispatch(removeSelectedKeys());
    dispatch({type: RESET_KEYS, payload: {keys: newKeys, mode: CLIPBOARD_COPY}});
};

export const removeClipboardKeys = () => (dispatch, getState) => {
    console.log('Removing clipboard keys');
    const { clipboardControls: { clipboardMode, clipboardKeys } } = getState();
    if(clipboardKeys && clipboardKeys.length > 0){
        clipboardKeys.forEach(key => {
            graphApi.removeClipboardMarks(key);
        });
    }
    dispatch({type: RESET_KEYS, payload: {keys: [], mode: CLIPBOARD_EMPTY}});
    dispatch(updateMarked());
};

export const resetClipboardKeys = () => (dispatch, getState) => {
    const { clipboardControls: { clipboardKeys, clipboardMode } } = getState();
    let newKeys = [];
    if(clipboardKeys && clipboardKeys.length > 0){
        let node;
        clipboardKeys.forEach(key => {
            node = graphApi.getNode(key);
            if(node){
                newKeys.push(key);
            }
        });
    }
    dispatch({type: RESET_KEYS, payload: {keys: newKeys, mode: clipboardMode}});
};

export const pasteBefore = (key) => (dispatch, getState) => {
    const { clipboardControls: { clipboardMode } } = getState();
    let resultKeys;
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteBeforeOrAfter(key, false);
        dispatch(removeClipboardKeys());
    } else if(clipboardMode === CLIPBOARD_COPY){
        resultKeys = graphApi.copyPasteBeforeOrAfter(key, false);
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const pasteAfter = (key) => (dispatch, getState) => {
    const { clipboardControls: { clipboardKeys, clipboardMode } } = getState();
    let resultKeys;
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteBeforeOrAfter(key, true);
        dispatch(removeClipboardKeys());
    } else if(clipboardMode === CLIPBOARD_COPY){
        resultKeys = graphApi.copyPasteBeforeOrAfter(key, true);
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const pasteFirst = (key) => (dispatch, getState) => {
    const { clipboardControls: { clipboardKeys, clipboardMode } } = getState();
    let resultKeys;
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteFirstOrLast(key, true);
        dispatch(removeClipboardKeys());
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const pasteLast = (key) => (dispatch, getState) => {
    const { clipboardControls: { clipboardKeys, clipboardMode } } = getState();
    let resultKeys;
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteFirstOrLast(key, false);
        dispatch(removeClipboardKeys());
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const pasteReplace = (key) => (dispatch, getState) => {
    const { clipboardControls: { clipboardKeys, clipboardMode } } = getState();
    let resultKeys;
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteReplace(key);
        dispatch(removeClipboardKeys());
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const pasteWrap = (key) => (dispatch, getState) => {
    const { clipboardControls: { clipboardKeys, clipboardMode } } = getState();
    let resultKeys;
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteWrap(key);
        dispatch(removeClipboardKeys());
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const containerActions = (dispatch) => bindActionCreators({
    removeClipboardKeys, pasteBefore, pasteAfter, pasteFirst, pasteLast, pasteReplace, pasteWrap
}, dispatch);
