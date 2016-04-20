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

import { matchPattern, formatPattern, getParams } from 'react-router/lib/PatternUtils.js';

export function getAvailableRoute(existingRoutes, checkPathname){
    let candidateRootKey = undefined;
    if(existingRoutes && existingRoutes.length > 0){
        if(checkPathname === '/' || checkPathname === '/structor-deskpage' || checkPathname === '/structor-deskpage/'){
            candidateRootKey = existingRoutes[0];
        } else {
            try{
                let root;
                for(let i = 0; i < existingRoutes.length; i++){
                    root = existingRoutes[i];
                    //console.log('Checking path: ' + root + ' against ' + checkPathname);
                    //let matched = matchPattern(root, checkPathname);
                    //console.log(JSON.stringify(matched, null, 4));
                    let paramsObj = getParams(root, checkPathname);
                    //console.log('paramsObj: ' + JSON.stringify(paramsObj));
                    let formattedPath = root;
                    if(paramsObj){
                        formattedPath = decodeURIComponent(formatPattern(root, paramsObj));
                    }
                    //console.log('formattedPath: ' + formattedPath);
                    if (checkPathname === formattedPath) {
                        candidateRootKey = root;
                        console.log('Path was found: ' + root + ', checked: ' + checkPathname);
                        break;
                    }
                }
            } catch(e){
                console.error('Path name ' + checkPathname + ' was not found in project model. Error: ' + (e.message ? e.message : e));
            }
        }
    }
    if(!candidateRootKey){
        console.error('Path name ' + checkPathname + ' was not found in project model.');
    }
    return candidateRootKey;
}
