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
import {setForCuttingKeys, setForCopyingKeys} from '../ClipboardIndicator/actions.js';
import {cloneSelected, moveSelected, deleteSelected} from '../SelectionControls/actions.js';
import {pasteBefore, pasteAfter, pasteFirst, pasteLast, pasteReplace} from '../ClipboardControls/actions.js';

export const containerActions = (dispatch) => bindActionCreators({
	setForCuttingKeys,
	setForCopyingKeys,
	cloneSelected,
	moveSelected,
	deleteSelected,
	pasteBefore,
	pasteAfter,
	pasteFirst,
	pasteLast,
	pasteReplace
}, dispatch);
