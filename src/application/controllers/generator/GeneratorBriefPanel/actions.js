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

import { pregenerate } from '../Generator/actions.js';
import { removeFromRecentGenerators } from '../GeneratorList/actions.js';

export const GET_GENERATOR_INFO = "GeneratorBriefPanel/GET_GENERATOR_INFO";
export const SET_GENERATOR_INFO = "GeneratorBriefPanel/SET_GENERATOR_INFO";

export const getGeneratorInfo = (userId, generatorId) =>
    ({type: GET_GENERATOR_INFO, payload: {generatorId, userId}});
export const setGeneratorInfo = (userId, generatorId, info) =>
    ({type: SET_GENERATOR_INFO, payload: {userId, generatorId, info}});

export const containerActions = (dispatch) => bindActionCreators({
    getGeneratorInfo, pregenerate, removeFromRecentGenerators
}, dispatch);