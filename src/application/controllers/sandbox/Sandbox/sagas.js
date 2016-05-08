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
import * as generatorSampleListActions from '../GeneratorCard/actions.js';
import * as generatorTemplateActions from '../GeneratorTemplate/actions.js';
import * as sandboxFilesListActions from '../SandboxFilesList/actions.js';
import * as generatorListActions from '../../generator/GeneratorList/actions.js';
import * as generatorActions from '../../generator/Generator/actions.js';
import * as appContainerActions from '../../app/AppContainer/actions.js';
import * as deskPageActions from '../../workspace/DeskPage/actions.js';
import { serverApi, utils, graphApi } from '../../../api';


function* prepareGeneratorSample(){
    while(true){
        const {payload:{generatorId, version, generatorKey, userId}} = yield take(actions.SET_GENERATOR_SAMPLE);
        yield put(spinnerActions.started('Preparing generator sample'));
        try {
            const generatorTemplate = yield call(serverApi.prepareGeneratorSampleSandbox, generatorId, version, generatorKey, userId);
            yield put(generatorTemplateActions.setTemplate(generatorTemplate));
            yield put(appContainerActions.showSandbox());
        } catch(error) {
            yield put(messageActions.failed('Generator sample preparing has an error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Preparing generator sample'));
    }
}

function* saveAndGenerateComponent(){
    while(true){
        const {payload:{sampleId, filesObject}} = yield take(actions.SAVE_AND_GENERATE_SANDBOX_COMPONENT);
        yield put(spinnerActions.started('Saving and compiling source code'));
        try {
            const generatedData = yield call(serverApi.saveAndGenerateSandboxComponent, sampleId, filesObject);
            yield put(sandboxFilesListActions.setGeneratedData(generatedData));
            yield put(actions.stepToStage(actions.STAGE2));
            //yield put(messageActions.success('Test component source code has been compiled successfully.'));
        } catch(error) {
            yield put(messageActions.failed('Generator sample compiling has an error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Saving and compiling source code'));
    }
}

function* publishGenerator(){
    while(true){
        const {payload:{sampleId, generatorKey, forceClone}} = yield take(actions.PUBLISH_GENERATOR_SAMPLE);
        yield put(spinnerActions.started('Publishing generator'));
        try {
            yield call(serverApi.publishSandboxGenerator, sampleId, generatorKey, forceClone);
            yield put(actions.stepToStage(actions.STAGE1));
            yield put(generatorActions.loadGenerators());
            yield put(generatorListActions.setFilterByGeneratorKey(generatorKey));
            yield put(messageActions.success('Generator sample has been published successfully. Please find generator by key ' + generatorKey));
        } catch(error) {
            yield put(messageActions.failed('Generator publishing has an error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Publishing generator'));
    }
}

// main saga
export default function* mainSaga() {
    yield fork(prepareGeneratorSample);
    yield fork(saveAndGenerateComponent);
    yield fork(publishGenerator);
    //yield fork(pregenerate);
    //yield fork(generate);
    //yield fork(saveGenerated);
};
