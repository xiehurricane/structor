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
import * as generatorSampleListActions from '../GeneratorSampleList/actions.js';
import * as generatorTemplateActions from '../GeneratorTemplate/actions.js';
import * as sandboxFilesListActions from '../SandboxFilesList/actions.js';
//import * as generatorListActions from '../GeneratorList/actions.js';
//import * as metadataFormActions from '../MetadataForm/actions.js';
import * as appContainerActions from '../../app/AppContainer/actions.js';
import * as deskPageActions from '../../workspace/DeskPage/actions.js';
import { serverApi, utils, graphApi } from '../../../api';

//function* pregenerate(){
//    while(true){
//        const {payload: {generatorId, version, model}} = yield take(actions.PREGENERATE);
//        yield put(spinnerActions.started('Retrieving metadata'));
//        try {
//            const pregeneratedData = yield call(serverApi.pregenerate, generatorId, version, undefined, undefined, model);
//            yield put(metadataFormActions.setSelectedGenerator({
//                generatorId,
//                version,
//                metaData: pregeneratedData.metaData,
//                metaHelp: pregeneratedData.metaHelp
//            }));
//            yield put(actions.stepToStage(actions.STAGE2));
//            let recentGenerators = utils.retrieveCookiesObject("structor-recent-generators-list");
//            recentGenerators = recentGenerators || [];
//            const existingIndex = recentGenerators.indexOf(generatorId);
//            if(existingIndex >= 0){
//                recentGenerators.splice(existingIndex, 1);
//            }
//            recentGenerators.splice(0, 0, generatorId);
//            utils.saveCookiesObject("structor-recent-generators-list", recentGenerators);
//            yield put(generatorListActions.setRecentGenerators(recentGenerators));
//        } catch(error) {
//            yield put(messageActions.failed('Metadata retrieving has an error. ' + (error.message ? error.message : error)));
//        }
//        yield put(spinnerActions.done('Retrieving metadata'));
//    }
//}
//
function* prepareGeneratorSample(){
    while(true){
        const {payload} = yield take(actions.SET_GENERATOR_SAMPLE);
        yield put(spinnerActions.started('Preparing generator sample'));
        try {
            const generatorTemplate = yield call(serverApi.prepareGeneratorSampleSandbox, payload);
            yield put(generatorTemplateActions.setTemplate(generatorTemplate));
            yield put(actions.stepToStage(actions.STAGE2));
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
            yield put(actions.stepToStage(actions.STAGE3));
            yield put(messageActions.success('Test component source code has been compiled successfully.'));
        } catch(error) {
            yield put(messageActions.failed('Generator sample compiling has an error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Saving and compiling source code'));
    }
}
//
//
//function* saveGenerated(){
//    while(true){
//        const {payload: {selectedKey, groupName, componentName, files, dependencies}} = yield take(actions.SAVE_GENERATED);
//        yield put(spinnerActions.started('Installing & saving the source code'));
//        try {
//            yield call(serverApi.saveGenerated, groupName, componentName, files, dependencies);
//            graphApi.changeModelNodeType(selectedKey, componentName);
//            yield put(deskPageActions.setReloadPageRequest());
//            yield put(actions.hide());
//        } catch(error) {
//            yield put(messageActions.failed('Source code installation has an error. ' + (error.message ? error.message : error)));
//        }
//        yield put(spinnerActions.done('Installing & saving the source code'));
//    }
//}

function* loadGeneratorSamples(){
    while(true){
        yield take(actions.LOAD_GENERATOR_SAMPLES);
        yield put(spinnerActions.started('Loading list of samples'));
        try {
            const samplesList = yield call(serverApi.getAvailableGeneratorSamplesList);
            yield put(generatorSampleListActions.setGeneratorSamples(samplesList));
            yield put(appContainerActions.showSandbox());
        } catch(error) {
            yield put(messageActions.failed('Samples loading has an error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Loading list of samples'));
    }
}

// main saga
export default function* mainSaga() {
    yield fork(loadGeneratorSamples);
    yield fork(prepareGeneratorSample);
    yield fork(saveAndGenerateComponent);
    //yield fork(pregenerate);
    //yield fork(generate);
    //yield fork(saveGenerated);
};
