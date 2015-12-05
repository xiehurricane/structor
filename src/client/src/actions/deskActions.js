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

export const START_EDIT_MODE = 'START_EDIT_MODE';
export const START_LIVE_PREVIEW_MODE = 'START_LIVE_PREVIEW_MODE';

export const TOGGLE_AVAILABLE_COMPONENTS = 'TOGGLE_AVAILABLE_COMPONENTS';
export const TOGGLE_QUICK_OPTIONS = 'TOGGLE_QUICK_OPTIONS';
export const TOGGLE_COMPONENTS_HIERARCHY = 'TOGGLE_COMPONENTS_HIERARCHY';

export const CHANGE_FRAME_WIDTH = 'CHANGE_FRAME_WIDTH';


export function startEditMode(){
    return {
        type: START_EDIT_MODE
    }
}

export function startLivePreviewMode(){
    return {
        type: START_LIVE_PREVIEW_MODE
    }
}

export function toggleAvailableComponents(){
    return {
        type: TOGGLE_AVAILABLE_COMPONENTS
    }
}

export function toggleQuickOptions(){
    return {
        type: TOGGLE_QUICK_OPTIONS
    }
}

export function toggleComponentsHierarchy(){
    return {
        type: TOGGLE_COMPONENTS_HIERARCHY
    }
}

export function changeFrameWidth(width){
    return {
        type: CHANGE_FRAME_WIDTH,
        payload: { width: width }
    }
}
