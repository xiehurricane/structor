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

export function fulex(obj2) {
    let obj1 = null;
    if (_.isArray(obj2)) {
        obj1 = [];
        for (let i = 0; i < obj2.length; i++) {
            obj1.push(fulex(obj2[i]));
        }
    } else if (_.isObject(obj2)) {
        obj1 = {};
        for (let item in obj2) {
            if (obj2.hasOwnProperty(item)) {
                obj1[item] = fulex(obj2[item]);
            }
        }
    } else {
        obj1 = obj2;
    }
    return obj1;
}


