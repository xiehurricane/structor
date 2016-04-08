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
import * as spinnerActions from '../AppSpinner/actions.js';
import * as messageActions from '../AppMessage/actions.js';
import * as generatorListActions from '../GeneratorsList/actions.js';
import * as appContainerActions from '../../app/AppContainer/actions.js';
import { serverApi, cookies } from '../../../api';

function* loadGenerators(){
    while(true){
        yield take(actions.LOAD_GENERATORS);
        yield put(spinnerActions.started('Loading available generators'));
        try {
            const generatorsList = yield call(serverApi.getAvailableGeneratorsList);
            yield put(generatorListActions.setGenerators(generatorsList));
            yield put(appContainerActions.showGenerator());
        } catch(error) {
            yield put(messageActions.failed('Generators loading has an error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Loading available generators'));
    }
}

// main saga
export default function* mainSaga() {
    yield [fork(loadGenerators)];
};
