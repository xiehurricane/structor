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
import * as actions from './actions.js';
import * as spinnerActions from '../../app/AppSpinner/actions.js';
import * as messageActions from '../../app/AppMessage/actions.js';
import * as generatorTemplateActions from '../GeneratorTemplate/actions.js';
import * as appContainerActions from '../../app/AppContainer/actions.js';
import { serverApi } from '../../../api';


function* prepareGeneratorSample(){
    while(true){
        const {payload:{componentName, model}} = yield take(actions.SET_GENERATOR_SAMPLE);
        yield put(spinnerActions.started('Preparing generator sample'));
        try {
            const generatorTemplate = yield call(serverApi.readComponentSources, componentName, model);
            yield put(generatorTemplateActions.setTemplate(generatorTemplate));
            yield put(appContainerActions.showSandbox());
        } catch(error) {
            yield put(messageActions.failed('Generator sample preparing has an error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Preparing generator sample'));
    }
}

// main saga
export default function* mainSaga() {
    yield fork(prepareGeneratorSample);
};
