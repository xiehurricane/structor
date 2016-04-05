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

import {hidePreviewComponent} from '../LibraryPanel/actions.js';

export const CHANGE_VIEWPORT_WIDTH = "Desk/CHANGE_VIEWPORT_WIDTH";
export const TOGGLE_LIBRARY_PANEL = "Desk/TOGGLE_LIBRARY_PANEL";
export const TOGGLE_PAGE_TREEVIEW = "Desk/TOGGLE_PAGE_TREEVIEW";
export const TOGGLE_QUICK_OPTIONS = "Desk/TOGGLE_QUICK_OPTIONS";
//export const

export const togglePageTreeview = () => ({ type: TOGGLE_PAGE_TREEVIEW });
export const toggleQuickOptions = () => ({ type: TOGGLE_QUICK_OPTIONS });
export const changeViewportWidth = (width) => ({type: CHANGE_VIEWPORT_WIDTH, payload: width});

export const toggleLibraryPanel = () => (dispatch, getState) => {
    dispatch(hidePreviewComponent());
    dispatch({ type: TOGGLE_LIBRARY_PANEL });
};

export const containerActions = (dispatch) => bindActionCreators({
    changeViewportWidth
}, dispatch);