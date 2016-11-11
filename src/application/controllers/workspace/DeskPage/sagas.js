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
import { fork, take, call, put, cancel } from 'redux-saga/effects';
import { SagaCancellationException } from 'redux-saga';
import { serverApi, graphApi, utils } from '../../../api';
import * as actions from './actions.js';
import * as spinnerActions from '../../app/AppSpinner/actions.js';
import * as messageActions from '../../app/AppMessage/actions.js';
import { pushHistory } from '../HistoryControls/actions.js';
import bows from 'bows';

const log = bows('deskSaga')

function* preserveModel(){
    while(true){
        yield take(actions.SAVE_MODEL);
        const model = graphApi.getModel();
        yield fork(serverApi.saveProjectModel, model);
    }
}

function* exportModel(){
    while(true){
        yield take(actions.EXPORT_MODEL);
        log('actions.EXPORT_MODEL导出');
        yield put(spinnerActions.started('Exporting the project model'));
        try{
            const model = graphApi.getModel();
            log('导出model：',model);
            yield call(serverApi.exportProjectModel, model);
            yield put(messageActions.success('Project model has been exported successfully.'));
        } catch(e){
            yield put(messageActions.failed('Project model exporting has an error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Exporting the project model'));
    }
}

const delay = ms => new Promise(resolve => setTimeout(() => resolve('timed out'), ms));

function* delayForPageLoaded(){
    try{
        yield call(delay, 300000);
        yield put(messageActions.timeout('Page loading is timed out. Look at the console output and try to fix error. ' +
            'Page will be reloaded automatically after successful compiling.'));
        yield put(actions.setReloadPageRequest());
        yield put(actions.pageLoadTimeout());
    } catch(e){
        if (e instanceof SagaCancellationException) {
            // do nothing
        }
    }
}

function* waitForPageLoaded(){
    while(true){
        yield take([actions.LOAD_PAGE, actions.RELOAD_PAGE]);
        yield put(spinnerActions.started('Loading page'));
        const delayTask = yield fork(delayForPageLoaded);
        yield take([actions.PAGE_LOADED, actions.PAGE_LOAD_TIMEOUT]);
        yield cancel(delayTask);
        yield put(spinnerActions.done('Loading page'));
    }
}

// main saga
export default function* mainSaga() {
    yield [
        fork(waitForPageLoaded),
        fork(preserveModel)
    ];
    yield fork(exportModel);
};
