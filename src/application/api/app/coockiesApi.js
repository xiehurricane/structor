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

import * as utils from '../utils/utils.js';

export function addToRecentGenerators(generatorId){
    let recentGenerators = utils.retrieveCookiesObject("structor-recent-generators-list");
    recentGenerators = recentGenerators || [];
    const existingIndex = recentGenerators.indexOf(generatorId);
    if(existingIndex >= 0){
        recentGenerators.splice(existingIndex, 1);
    }
    recentGenerators.splice(0, 0, generatorId);
    utils.saveCookiesObject("structor-recent-generators-list", recentGenerators);
    return recentGenerators;
}

export function removeFromRecentGenerators(generatorId){
    let recentGenerators = utils.retrieveCookiesObject("structor-recent-generators-list");
    recentGenerators = recentGenerators || [];
    const existingIndex = recentGenerators.indexOf(generatorId);
    if(existingIndex >= 0){
        recentGenerators.splice(existingIndex, 1);
    }
    utils.saveCookiesObject("structor-recent-generators-list", recentGenerators);
    return recentGenerators;
}

export function getRecentGenerators(){
    let recentGenerators = utils.retrieveCookiesObject("structor-recent-generators-list");
    return recentGenerators;
}
