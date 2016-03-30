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
import { utils, utilsStore, graphApi } from '../../../../api';

export const SET_SELECTED_KEY = "DeskPage/SET_SELECTED_KEY";
export const UPDATE_SELECTED = "DeskPage/UPDATE_SELECTED";

export const updateSelected = () => ({type: UPDATE_SELECTED});

export const setSelectedKey = (key, isModifier) => (dispatch, getState) => {
    let { deskPage: { selectedKeys } } = getState();
    let filtered = selectedKeys.filter(selectedKey => key === selectedKey);
    console.log('Filtered size: ' + filtered.length);
    if(filtered.length === 0){
        if (selectedKeys.length > 0 && !isModifier) {
            selectedKeys.forEach(selectedKey => {
                let graphNode = graphApi.getNode(selectedKey);
                if (graphNode) {
                    graphNode.selected = undefined;
                } else {
                    dispatch(failed('Currently selected component with id \'' + key + '\' was not found'));
                }
            });
            selectedKeys = [];
        }
        let nextGraphNode = graphApi.getNode(key);
        if(nextGraphNode){
            nextGraphNode.selected = true;
            selectedKeys.push(key);
            dispatch({type: SET_SELECTED_KEY, payload: selectedKeys});
        } else {
            dispatch(failed('Required to be selected component with id \'' + key + '\' was not found'));
        }
    } else {
        if(selectedKeys.length > 0){
            let graphNode = graphApi.getNode(key);
            if (isModifier) {
                if (graphNode) {
                    graphNode.selected = undefined;
                    selectedKeys = selectedKeys.filter(selectedKey => key !== selectedKey);
                    dispatch({type: SET_SELECTED_KEY, payload: selectedKeys});
                } else {
                    dispatch(failed('Currently selected component with id \'' + key + '\' was not found'));
                }
            } else {
                if(graphNode){
                    selectedKeys.forEach(selectedKey => {
                        let selectedGraphNode = graphApi.getNode(selectedKey);
                        if (selectedGraphNode) {
                            selectedGraphNode.selected = undefined;
                        } else {
                            dispatch(failed('Currently selected component with id \'' + key + '\' was not found'));
                        }
                    });
                    graphNode.selected = true;
                    selectedKeys = [key];
                    dispatch({type: SET_SELECTED_KEY, payload: selectedKeys});
                } else {
                    dispatch(failed('Required to be selected component with id \'' + key + '\' was not found'));
                }
            }
        }
    }
};

export const setSelectedParentKey = (key, isModifier) => (dispatch, getState) => {
    const parentKey = graphApi.getGraph().parent(key);
    if(parentKey){
        const parentParentKey = graphApi.getGraph().parent(parentKey);
        if(parentParentKey){
            dispatch(setSelectedKey(parentKey, isModifier));
        }
    }
};

export const setHighlightSelectedKey = (key, isHighlighted) => (dispatch, getState) => {
    let graphNode = graphApi.getNode(key);
    if(graphNode){
        if(!isHighlighted){
            graphNode.highlighted = undefined;
        } else if(isHighlighted){
            graphNode.highlighted = true;
        }
        dispatch(updateSelected());
    }
};

export const resetSelectedKeys = () => (dispatch, getState) => {
    let { deskPage: {selectedKeys}} = getState();
    let newSelectedKeys = [];
    let selectedNode;
    if(selectedKeys && selectedKeys.length > 0){
        selectedKeys.forEach(key => {
            selectedNode = graphApi.getNode(key);
            if(selectedNode && selectedNode.selected){
                newSelectedKeys.push(key);
            }
        });
        dispatch({type: SET_SELECTED_KEY, payload: newSelectedKeys});
    }
};
