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

import { bindActionCreators } from 'redux';
//import { loadOptions } from '../ComponentOptionsModal/actions.js';
//import { showGeneratorFrame } from '../../app/AppContainer/actions.js';

export const GET_PROJECT_GALLERY_LIST = "ProjectGallery/GET_PROJECT_GALLERY_LIST";
export const SET_PROJECT_GALLERY_LIST = "ProjectGallery/SET_PROJECT_GALLERY_LIST";
export const DOWNLOAD_PROJECT = "ProjectGallery/DOWNLOAD_PROJECT";

export const getProjectGalleryList = () => ({type: GET_PROJECT_GALLERY_LIST});
export const setProjectGalleryList = (list) => ({type: SET_PROJECT_GALLERY_LIST, payload: list});
export const downloadProject = (url) => ({type: DOWNLOAD_PROJECT, payload: url});

export const containerActions = (dispatch) => bindActionCreators({
    getProjectGalleryList, downloadProject
}, dispatch);
