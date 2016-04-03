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
import { removeClipboardKeys, CLIPBOARD_COPY, CLIPBOARD_CUT, CLIPBOARD_NEW } from '../ClipboardIndicator/actions.js';
import { pushHistory } from '../HistoryControls/actions.js';

export const pasteBefore = (key) => (dispatch, getState) => {
    const { clipboardIndicator: {clipboardMode}} = getState();
    let resultKeys;
    dispatch(pushHistory());
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteBeforeOrAfter(key, false);
        dispatch(removeClipboardKeys());
    } else if(clipboardMode === CLIPBOARD_COPY){
        resultKeys = graphApi.copyPasteBeforeOrAfter(key, false);
    } else if(clipboardMode === CLIPBOARD_NEW){
        resultKeys = graphApi.fromBufferBeforeOrAfter(key, false);
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const pasteAfter = (key) => (dispatch, getState) => {
    const { clipboardIndicator: {clipboardMode}} = getState();
    let resultKeys;
    dispatch(pushHistory());
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteBeforeOrAfter(key, true);
        dispatch(removeClipboardKeys());
    } else if(clipboardMode === CLIPBOARD_COPY){
        resultKeys = graphApi.copyPasteBeforeOrAfter(key, true);
    } else if(clipboardMode === CLIPBOARD_NEW){
        resultKeys = graphApi.fromBufferBeforeOrAfter(key, true);
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const pasteFirst = (key) => (dispatch, getState) => {
    const { clipboardIndicator: {clipboardMode}} = getState();
    let resultKeys;
    dispatch(pushHistory());
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteFirstOrLast(key, true);
        dispatch(removeClipboardKeys());
    } else if(clipboardMode === CLIPBOARD_COPY){
        resultKeys = graphApi.copyPasteFirstOrLast(key, true);
    } else if(clipboardMode === CLIPBOARD_NEW){
        resultKeys = graphApi.fromBufferFirstOrLast(key, true);
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const pasteLast = (key) => (dispatch, getState) => {
    const { clipboardIndicator: {clipboardMode}} = getState();
    let resultKeys;
    dispatch(pushHistory());
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteFirstOrLast(key, false);
        dispatch(removeClipboardKeys());
    } else if(clipboardMode === CLIPBOARD_COPY){
        resultKeys = graphApi.copyPasteFirstOrLast(key, false);
    } else if(clipboardMode === CLIPBOARD_NEW){
        resultKeys = graphApi.fromBufferFirstOrLast(key, false);
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const pasteReplace = (key) => (dispatch, getState) => {
    const { clipboardIndicator: {clipboardMode}} = getState();
    let resultKeys;
    dispatch(pushHistory());
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteReplace(key);
        dispatch(removeClipboardKeys());
    } else if(clipboardMode === CLIPBOARD_COPY){
        resultKeys = graphApi.copyPasteReplace(key);
    } else if(clipboardMode === CLIPBOARD_NEW){
        resultKeys = graphApi.fromBufferReplace(key);
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const pasteWrap = (key) => (dispatch, getState) => {
    const { clipboardIndicator: {clipboardMode}} = getState();
    let resultKeys;
    dispatch(pushHistory());
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteWrap(key);
        dispatch(removeClipboardKeys());
    } else if(clipboardMode === CLIPBOARD_COPY){
        resultKeys = graphApi.copyPasteWrap(key);
    } else if(clipboardMode === CLIPBOARD_NEW){
        resultKeys = graphApi.fromBufferWrap(key);
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const containerActions = (dispatch) => bindActionCreators({
    pasteBefore, pasteAfter, pasteFirst, pasteLast, pasteReplace, pasteWrap
}, dispatch);
