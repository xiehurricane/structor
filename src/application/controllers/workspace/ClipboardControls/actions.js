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
import { showModal as showQuickAppend } from '../QuickAppendModal/actions.js';

const setTargetKey = (targetKey, selectedKeys) => {
    let selectedNode;
    if(selectedKeys && selectedKeys.length > 0){
        selectedKeys.forEach(key => {
            selectedNode = graphApi.getNode(key);
            if(selectedNode && selectedNode.selected){
                selectedNode.selected = undefined;
            }
        });
    }
    let nextGraphNode = graphApi.getNode(targetKey);
    if(nextGraphNode){
        nextGraphNode.selected = true;
    }
};

export const pasteBefore = (targetKey) => (dispatch, getState) => {
    const { clipboardIndicator: {clipboardMode}, selectionBreadcrumbs: {selectedKeys}} = getState();
    let resultKeys;
    if(targetKey){
        dispatch(setSelectedKeys([targetKey]));
    }
    dispatch(pushHistory());
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteBeforeOrAfter(false);
        dispatch(removeClipboardKeys());
    } else if(clipboardMode === CLIPBOARD_COPY){
        resultKeys = graphApi.copyPasteBeforeOrAfter(false);
    } else if(clipboardMode === CLIPBOARD_NEW){
        resultKeys = graphApi.fromBufferBeforeOrAfter(false);
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const pasteAfter = (targetKey) => (dispatch, getState) => {
    const { clipboardIndicator: {clipboardMode}, selectionBreadcrumbs: {selectedKeys}} = getState();
    let resultKeys;
    if(targetKey){
        dispatch(setSelectedKeys([targetKey]));
    }
    dispatch(pushHistory());
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteBeforeOrAfter(true);
        dispatch(removeClipboardKeys());
    } else if(clipboardMode === CLIPBOARD_COPY){
        resultKeys = graphApi.copyPasteBeforeOrAfter(true);
    } else if(clipboardMode === CLIPBOARD_NEW){
        resultKeys = graphApi.fromBufferBeforeOrAfter(true);
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const pasteFirst = (targetKey) => (dispatch, getState) => {
    const { clipboardIndicator: {clipboardMode}, selectionBreadcrumbs: {selectedKeys}} = getState();
    let resultKeys;
    if(targetKey){
        dispatch(setSelectedKeys([targetKey]));
    }
    dispatch(pushHistory());
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteFirstOrLast(true);
        dispatch(removeClipboardKeys());
    } else if(clipboardMode === CLIPBOARD_COPY){
        resultKeys = graphApi.copyPasteFirstOrLast(true);
    } else if(clipboardMode === CLIPBOARD_NEW){
        resultKeys = graphApi.fromBufferFirstOrLast(true);
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const pasteLast = (targetKey) => (dispatch, getState) => {
    const { clipboardIndicator: {clipboardMode}, selectionBreadcrumbs: {selectedKeys}} = getState();
    let resultKeys;
    if(targetKey){
        dispatch(setSelectedKeys([targetKey]));
    }
    dispatch(pushHistory());
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteFirstOrLast(false);
        dispatch(removeClipboardKeys());
    } else if(clipboardMode === CLIPBOARD_COPY){
        resultKeys = graphApi.copyPasteFirstOrLast(false);
    } else if(clipboardMode === CLIPBOARD_NEW){
        resultKeys = graphApi.fromBufferFirstOrLast(false);
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

export const pasteReplace = (targetKey) => (dispatch, getState) => {
    const { clipboardIndicator: {clipboardMode}, selectionBreadcrumbs: {selectedKeys}} = getState();
    let resultKeys;
    if(targetKey){
        dispatch(setSelectedKeys([targetKey]));
    }
    dispatch(pushHistory());
    if(clipboardMode === CLIPBOARD_CUT){
        resultKeys = graphApi.cutPasteReplace();
        dispatch(removeClipboardKeys());
    } else if(clipboardMode === CLIPBOARD_COPY){
        resultKeys = graphApi.copyPasteReplace();
    } else if(clipboardMode === CLIPBOARD_NEW){
        resultKeys = graphApi.fromBufferReplace();
    }
    if(resultKeys && resultKeys.length > 0){
        dispatch(setSelectedKeys(resultKeys));
        dispatch(updatePage());
    }
};

//export const pasteWrap = (key) => (dispatch, getState) => {
//    const { clipboardIndicator: {clipboardMode}} = getState();
//    let resultKeys;
//    dispatch(pushHistory());
//    if(clipboardMode === CLIPBOARD_CUT){
//        resultKeys = graphApi.cutPasteWrap();
//        dispatch(removeClipboardKeys());
//    } else if(clipboardMode === CLIPBOARD_COPY){
//        resultKeys = graphApi.copyPasteWrap();
//    } else if(clipboardMode === CLIPBOARD_NEW){
//        resultKeys = graphApi.fromBufferWrap();
//    }
//    if(resultKeys && resultKeys.length > 0){
//        dispatch(setSelectedKeys(resultKeys));
//        dispatch(updatePage());
//    }
//};

export const containerActions = (dispatch) => bindActionCreators({
    pasteBefore, pasteAfter, pasteFirst, pasteLast, pasteReplace, showQuickAppend
}, dispatch);
