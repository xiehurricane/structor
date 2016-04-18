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

import path from 'path';
import * as config from '../commons/configuration.js';
import * as fileManager from '../commons/fileManager.js';
import * as validator from '../commons/validator.js';
import * as modelParser from '../commons/modelParser.js';

function isFirstCharacterInUpperCase(text){
    if (text && text.length > 0) {
        let firstChar = text.charAt(0);
        let firstCharUpperCase = firstChar.toUpperCase();
        return firstChar === firstCharUpperCase;
    }
    return false;
}

export function readProjectJsonModel(){
    return fileManager.readJson(config.deskModelFilePath());
}

export function readDefaults(componentName){
    let lookupComponentName =
        isFirstCharacterInUpperCase(componentName) ? componentName : ('html-' + componentName);
    let filePath = path.join(config.componentDefaultsDirPath(), lookupComponentName + '.json');
    return fileManager.readJson(filePath)
        .then(fileData => {
            if(fileData.length > 0){
                fileData.forEach(data => {
                    modelParser.cleanModel(data);
                });
            }
            return fileManager.writeJson(filePath, fileData)
                .then(() => {
                    return fileData;
                });
        })
        .catch( err => {
            return [];
        });
}

export function readComponentDocument(componentName){
    const componentNoteFilePath = path.join(config.docsComponentsDirPath(), componentName + '.md');
    return fileManager.readFile(componentNoteFilePath)
        .then( fileData => {
            fileData = fileData || 'Component does not have notes';
            return fileData;
        })
        .catch(e => {
            return 'Component does not have notes';
        });
}

export function readComponentSourceCode(filePath){
    return fileManager.readFile(filePath);
}

export function writeComponentSourceCode(filePath, sourceCode){
    return validator.validateJSCode(sourceCode)
        .then(() => {
            return fileManager.writeFile(filePath, sourceCode, false);
        });
}

export function writeProjectJsonModel(jsonObj){
    if(jsonObj && jsonObj.pages && jsonObj.pages.length > 0){
        jsonObj.pages.forEach(page => {
            modelParser.cleanModel(page);
        });
    }
    return fileManager.writeJson(config.deskModelFilePath(), jsonObj);
}