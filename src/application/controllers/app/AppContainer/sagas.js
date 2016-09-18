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
import validator from 'validator';
import { SagaCancellationException } from 'redux-saga';
import { fork, take, call, put, race, cancel } from 'redux-saga/effects';
import * as actions from './actions.js';
import * as signInModalActions from '../SignInModal/actions.js';
import * as spinnerActions from '../AppSpinner/actions.js';
import * as messageActions from '../AppMessage/actions.js';
import * as deskActions from '../../workspace/Desk/actions.js';
import * as deskPageActions from '../../workspace/DeskPage/actions.js';
import * as libraryPanelActions from '../../workspace/LibraryPanel/actions.js';
import { serverApi, cookies } from '../../../api';

const delay = ms => new Promise(resolve => setTimeout(() => resolve('timed out'), ms));

function* signInByToken(){
    let tokenFromCookies = cookies.getItem("structor-market-token");
    if (tokenFromCookies) {
        try{
            const userCredentials = yield call(serverApi.initUserCredentialsByToken, tokenFromCookies);
            yield put(actions.signInDone(userCredentials));
        } catch(e){
            console.warn(e.message ? e.message : e);
        }
    }
}

function* signIn(){
    while(true){
        const {payload: {email, password, staySignedIn}} = yield take(actions.SIGN_IN);
        if(!email || email.length <= 0){
            yield put(actions.signInFailed('Please enter e-mail address value'));
        } else if( !validator.isEmail(email) ){
            yield put(actions.signInFailed('Please enter valid e-mail address value'));
        } else {
            yield put(spinnerActions.started('Signing in'));
            try{
                const response = yield call(serverApi.initUserCredentials, email, password);
                if(staySignedIn === true){
                    cookies.setItem("structor-market-token", response.token, 31536e3, "/");
                }
                yield put(actions.signInDone(response));
                yield put(signInModalActions.hideModal());
                yield put(messageActions.success('Signing in to your account has been done successfully.'));
            } catch(e){
                yield put(actions.signInFailed(e));
            }
            yield put(spinnerActions.done('Signing in'));
        }
    }
}

function* signOut(){
    while(true){
        yield take(actions.SIGN_OUT);
        yield call(serverApi.removeUserCredentials);
        cookies.removeItem("structor-market-token", "/");
        yield put(actions.signOutDone());
        yield put(messageActions.success('Signing out has been done successfully.'));
    }
}

function* delayForCompiler(){
    try{
        yield call(delay, 300000);
        yield put(messageActions.timeout('The source code compiling is timed out. Look at console output or reload the browser page.'));
        yield put(deskPageActions.setReloadPageRequest());
        yield put(actions.compilerTimeout());
    } catch(e) {
        if (e instanceof SagaCancellationException) {
            // do nothing
        }
    }
}

function* waitForCompiler(){
    while(true){
        yield take(actions.COMPILER_START);
        yield put(spinnerActions.started('Compiling the source code'));
        const delayTask = yield fork(delayForCompiler);
        yield take([actions.COMPILER_DONE, actions.COMPILER_TIMEOUT]);
        yield cancel(delayTask);
        yield put(spinnerActions.done('Compiling the source code'));
    }
}

//function* loadProjectInfo(){
//    try{
//        return yield call(serverApi.getProjectInfo);
//    } catch(error){
//        if(error instanceof SagaCancellationException){
//            yield put(messageActions.failed('Project loading was canceled.'));
//        } else {
//            yield put(messageActions.failed('Project loading has an error. ' + (error.message ? error.message : error)));
//        }
//    }
//}

//function* loadProject(){
//    yield take(actions.GET_PROJECT_INFO);
//    yield put(spinnerActions.started('Loading project'));
//    try {
//        yield call(signInByToken);
//        const {timeout, response} = yield race({
//            response: call(loadProjectInfo),
//            timeout: call(delay, 30000)
//        });
//        if(response){
//            const {projectConfig, projectStatus} = response;
//            if(projectStatus === 'ready-to-go'){
//                const model = yield call(serverApi.getProjectModel);
//                const componentsTree = yield call(serverApi.loadComponentsTree);
//                yield put(libraryPanelActions.setComponents(componentsTree));
//                yield put(deskPageActions.loadModel(model || {}));
//            }
//            yield put(actions.getProjectInfoDone({projectConfig}));
//
//        } else if(timeout) {
//            yield put(messageActions.timeout('Project loading is timed out.'));
//        }
//    } catch(error) {
//        yield put(messageActions.failed('Project loading has an error. ' + (error.message ? error.message : error)));
//    }
//    yield put(spinnerActions.done('Loading project'));
//}

function* getProjectStatus(){
    while(true){
        yield take(actions.GET_PROJECT_STATUS);
        yield put(spinnerActions.started('Loading project'));
        try{
            yield call(signInByToken);
            const status = yield call(serverApi.getProjectStatus);
            if(status === 'ready-to-go'){
                const model = yield call(serverApi.getProjectModel);
                const componentsTree = yield call(serverApi.loadComponentsTree);
                yield put(libraryPanelActions.setComponents(componentsTree));
                yield put(deskPageActions.loadModel(model || {}));

                const projectInfo = yield call(serverApi.getProjectInfo);
                yield put(actions.setProjectInfo(projectInfo));

                yield put(actions.showDesk());
            } else {
                yield put(messageActions.failed('Loading error of the current project'));
            }
        } catch(error) {
            yield put(messageActions.failed('Obtaining project status error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Loading project'));
    }
}

// main saga
export default function* mainSaga() {
    yield fork(getProjectStatus);
    yield fork(signIn);
    yield fork(signOut);
    yield fork(waitForCompiler)
};
