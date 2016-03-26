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
import { changePageOptions } from '../DeskPage/actions.js';

export const HIDE_MODAL = "PageOptionsModal/HIDE_MODAL";
export const SHOW_MODAL = "PageOptionsModal/SHOW_MODAL";
//import { changeViewportWidth } from '../Desk/actions.js';
//import { addNewPage, clonePage } from '../DeskPage/actions.js';

export const hideModal = () => ({type: HIDE_MODAL});
export const showModal = () => ({type: SHOW_MODAL});

export const containerActions = (dispatch) => bindActionCreators({
    hideModal, showModal, changePageOptions
}, dispatch);
