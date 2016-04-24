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

import { SagaCancellationException } from 'redux-saga';
import { fork, take, call, put, race } from 'redux-saga/effects';
import * as actions from './actions.js';
import { actions as spinnerActions } from '../AppSpinner/index.js';
import { actions as messageActions } from '../AppMessage/index.js';
import { actions as appContainerActions } from '../AppContainer/index.js';
import { serverApi } from '../../../api';

const delay = ms => new Promise(resolve => setTimeout(() => resolve('timed out'), ms));

function* downloadProject(url){
    try{
        return yield call(serverApi.prepareProject, url);
    } catch(error){
        if(error instanceof SagaCancellationException){
            yield put(messageActions.failed('Cloning & installing were canceled.'));
        } else {
            yield put(messageActions.failed('Cloning & installing error. ' + (error.message ? error.message : error)));
        }
    }
}

function* triggerDownloadProject(){
    while(true){
        const {payload} = yield take(actions.DOWNLOAD_PROJECT);
        yield put(spinnerActions.started('Cloning project & installing packages'));
        try {
            const {timeout, response} = yield race({
                response: call(downloadProject, payload),
                timeout: call(delay, 480000)
            });
            if(response){
                yield put(appContainerActions.getProjectStatus());
            } else if(timeout) {
                yield put(messageActions.timeout('Cloning project & installing packages are timed out.'));
            }
        } catch(error) {
            yield put(messageActions.failed('Cloning project & installing packages error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Cloning project & installing packages'));
    }
}


function* triggerProjectGalleryList(){
    while(true){
        yield take(actions.GET_PROJECT_GALLERY_LIST);
        yield put(spinnerActions.started("Loading projects gallery"));
        try{
            const list = yield call(serverApi.getProjectList);
            yield put(actions.setProjectGalleryList(list));
        } catch(error) {
            yield put(messageActions.failed('Projects gallery loading error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done("Loading projects gallery"));
    }
}

// main saga
export default function* mainSaga() {
    yield fork(triggerProjectGalleryList);
    yield fork(triggerDownloadProject);

};
