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
import { fork, take } from 'redux-saga/effects';
import appContainerSaga from '../controllers/app/AppContainer/sagas.js';
import appMessageSaga from '../controllers/app/AppMessage/sagas.js';
import deskPageSaga from '../controllers/workspace/DeskPage/sagas.js';
import libraryPanelSaga from '../controllers/workspace/LibraryPanel/sagas.js';
import componentOptionsSaga from '../controllers/workspace/ComponentOptionsModal/sagas.js';
import generatorSaga from '../controllers/generator/Generator/sagas.js';
import generatorBriefPanelSaga from '../controllers/generator/GeneratorBriefPanel/sagas.js';

export default function* mainSaga(){
    yield [
        fork(appContainerSaga),
        fork(appMessageSaga),
        fork(deskPageSaga),
        fork(libraryPanelSaga),
        fork(componentOptionsSaga)
    ];
    yield fork(generatorSaga);
    yield fork(generatorBriefPanelSaga);
}
