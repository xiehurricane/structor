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
import { fork, take, call, put, race } from 'redux-saga/effects';
import * as actions from './actions.js';
import { actions as spinnerActions } from '../AppSpinner/index.js';
import { actions as messageActions } from '../AppMessage/index.js';
import { serverApi } from '../../../api/index.js';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function* getProjectInfo(){
    while(true){
        yield take(actions.GET_PROJECT_INFO);
        try {
            yield put(spinnerActions.started(actions.GET_PROJECT_INFO));
            const {timeout, response} = yield race({
                response: call(serverApi.getProjectInfo),
                timeout: call(delay, 30000)
            });
            if(response){
                yield put(actions.getProjectInfoDone(response));
                yield put(messageActions.success('Project info obtained successfully.'));
            } else {
                yield put(messageActions.timeout('Project info timed out.'));
            }
        } catch(error) {
            yield put(actions.getProjectInfoFail(error));
            yield put(messageActions.failed('Project info timed out.'));
        }
        yield put(spinnerActions.done(actions.GET_PROJECT_INFO));
    }
}

// main saga
export default function* mainSaga() {
    yield [fork(getProjectInfo)];

};
