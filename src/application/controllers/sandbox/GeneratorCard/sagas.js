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
import { actions as spinnerActions } from '../../app/AppSpinner/index.js';
import { actions as messageActions } from '../../app/AppMessage/index.js';
import { restApi } from '../../../api/index.js';
//
//const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
//
function* uploadScreenshot(){
    while(true){
        const {payload} = yield take(actions.UPLOAD_SCREENSHOT);
        yield put(spinnerActions.started('Uploading image'));
        try {

            yield call(restApi.uploadScreenshot, payload);
            yield put(actions.uploadScreenshotDone());
        } catch(error) {
            yield put(messageActions.failed('Uploading image error. ' + String(error)));
        }
        yield put(spinnerActions.done('Uploading image'));
    }
}

// main saga
export default function* mainSaga() {
    yield [fork(uploadScreenshot)];

};
