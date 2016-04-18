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
import * as fileManager from '../commons/fileManager.js';

export function writeProject(destDirPath, fileData){
    let destFilePath = path.join(destDirPath, '__app.tar.gz');
    let tempFilePath;
    return fileManager.writeBinaryFile(destFilePath, fileData)
        .then(() => {
            return fileManager.repackTarGzOmitRootDir(destFilePath);
        })
        .then(tarFilePathTemp => {
            tempFilePath = tarFilePathTemp;
            return fileManager.unpackTar(tarFilePathTemp, destDirPath);
        })
        .then(() => {
            return fileManager.removeFile(tempFilePath);
        })
        .then(() => {
            return fileManager.removeFile(destFilePath);
        });
}
