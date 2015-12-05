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
import path from 'path';
import FileManager from './FileManager.js';
import * as fileParser from './FileParser.js';

class Validator {

    constructor(){
        this.fileManager = new FileManager();
    }

    validateEmptyDir(dirPath){
        return this.fileManager.checkDirIsEmpty(dirPath);
    }

    validateJSCode(sourceCode){
        return new Promise((resolve, reject) => {
            try{
                fileParser.validateSourceCode(sourceCode);
                resolve();
            } catch(e){
                reject(e);
            }
        });
    }

    validateOptions(options, props){
        return new Promise((resolve, reject) => {
            if(!options){
                reject('Options is not specified');
            } else {
                let notFound = [];
                if(_.isArray(props)){
                    props.forEach( item => {
                        if( _.isUndefined(options[item]) || _.isNull(options[item])){
                            notFound.push(item);
                        }
                    });
                } else if(_.isString(props)){
                    if( _.isUndefined(options[props]) || _.isNull(options[props]) ){
                        notFound.push(props);
                    }
                }
                if(notFound.length === 1){
                    reject('Option is not available or null: ' + _(notFound).toString());
                } else if(notFound.length > 1) {
                    reject('Options is not available or null: ' + _(notFound).toString());
                } else {
                    resolve();
                }
            }
        });
    }

}

export default Validator;
