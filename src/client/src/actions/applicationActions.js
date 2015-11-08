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