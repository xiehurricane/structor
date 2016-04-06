
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

import _ from 'lodash';
import esprima from 'esprima-fb';

// Executes visitor on the object and its children (recursively).
export function traverse(object, visitor) {

    visitor(object);

    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            let child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

export function getFileAst(fileData){
    //console.log(fileData);
    let result = null;
    try{
        result = esprima.parse(fileData, {tolerant: true, range: true, comment: true});
    } catch(e){
        throw Error('Can not parse file, error: ' + e.message);
    }
    return result;
}

export function validateSourceCode(fileData){
    try{
        esprima.parse(fileData, { tolerant: true });
    } catch(e){
        throw Error('File is not valid, error: ' + e.message);
    }
}

