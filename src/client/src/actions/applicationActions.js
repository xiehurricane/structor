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

import * as Utils from '../api/utils.js';
import * as UtilStore from '../api/utilStore.js';
import * as ServerActions from './serverActions.js';
export const SET_APPLICATION_STAGE = 'SET_APPLICATION_STAGE';
export const EXPORT_APPLICATION = 'EXPORT_APPLICATION';

export function setApplicationStage(stage){
    return {
        type: SET_APPLICATION_STAGE,
        payload: { stage: stage }
    }
}

export function exportApplication(){
    return (dispatch, getState) => {
        const { deskPage: { model } } = getState();
        let cloneModel = UtilStore.removeMarksFromModel(Utils.fulex(model));
        if(cloneModel.pages && cloneModel.pages.length > 0){
            cloneModel.pages.forEach( page => {
                Utils.cleanPropsUmyId(page)
            });
        }

        dispatch(
            ServerActions.invoke('exportPages',
                { projectModel: cloneModel },
                [ServerActions.SET_SERVER_MESSAGE_BY_OPTIONS],
                { text: 'Pages were exported successfully.', isError: false }
            )
        );
    }
}

export function saveProject(){
    return (dispatch, getState) => {
        const { deskPage: { model } } = getState();
        const cloneModel = UtilStore.removeMarksFromModel(Utils.fulex(model));
        dispatch(
            ServerActions.invoke('saveProjectModel',
                { model: cloneModel },
                [ServerActions.SET_SERVER_MESSAGE_BY_OPTIONS],
                { text: 'Project was saved successfully.', isError: false }
            )
        );

    }
}