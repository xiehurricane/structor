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
import { serverApi, cookies } from '../../../api';
//
//const delay = ms => new Promise(resolve => setTimeout(() => resolve('timed out'), ms));
//
function* getInfo(userId, generatorId){
    try{
        const textInfo = yield call(serverApi.getGeneratorInfo, userId, generatorId);
        yield put(actions.setGeneratorInfo(userId, generatorId, {brief: textInfo}));
    } catch(e){
        console.warn(e.message ? e.message : e);
    }
}

function* getGeneratorInfo(){
    while(true){
        const {payload: {userId, generatorId}} = yield take(actions.GET_GENERATOR_INFO);
        yield fork(getInfo, userId, generatorId);
    }
}
// main saga
export default function* mainSaga() {
    yield [fork(getGeneratorInfo)];

};
