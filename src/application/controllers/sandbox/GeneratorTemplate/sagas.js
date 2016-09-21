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
import * as appContainerActions from '../../app/AppContainer/actions.js';
import { restApi, serverApi } from '../../../api/index.js';

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

function* publishGenerator(){
	while(true){
		const {payload:{generatorKey, dataObject}} = yield take(actions.PUBLISH_GENERATOR);
		yield put(spinnerActions.started('Publishing generator'));
		try {
			const {generatorId, dirNamePath} = yield call(serverApi.publishGenerator, generatorKey, dataObject);
			yield put(appContainerActions.hideSandbox());
			yield put(messageActions.success('Generator has been published successfully. Please find generator by key: "' + dirNamePath + '"', 20000));
		} catch(error) {
			yield put(messageActions.failed('Generator publishing has an error. ' + (error.message ? error.message : error)));
		}
		yield put(spinnerActions.done('Publishing generator'));
	}
}

// main saga
export default function* mainSaga() {
	yield fork(uploadScreenshot);
	yield fork(publishGenerator);
};
