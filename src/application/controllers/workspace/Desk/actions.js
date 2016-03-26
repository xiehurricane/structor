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

export const CHANGE_VIEWPORT_WIDTH = "Desk/CHANGE_VIEWPORT_WIDTH";
export const TOGGLE_AVAILABLE_COMPONENTS = "Desk/TOGGLE_AVAILABLE_COMPONENTS";
export const TOGGLE_PAGE_TREEVIEW = "Desk/TOGGLE_PAGE_TREEVIEW";
export const TOGGLE_QUICK_OPTIONS = "Desk/TOGGLE_QUICK_OPTIONS";


export const toggleAvailableComponents = () => ({ type: TOGGLE_AVAILABLE_COMPONENTS });
export const togglePageTreeview = () => ({ type: TOGGLE_PAGE_TREEVIEW });
export const toggleQuickOptions = () => ({ type: TOGGLE_QUICK_OPTIONS });
export const changeViewportWidth = (width) => ({type: CHANGE_VIEWPORT_WIDTH, payload: width});

export const containerActions = (dispatch) => bindActionCreators({
    changeViewportWidth
}, dispatch);