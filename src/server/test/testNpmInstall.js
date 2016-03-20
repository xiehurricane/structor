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
import child_process from 'child_process';
const exec = child_process.exec;

function installPackages(pkgNames){
    return new Promise( (resolve, reject) => {
        try{
            let child = exec(`npm set progress=false && npm install ${pkgNames} && npm set progress=true`, {cwd: this.sm.getProject('dirPath')},
                (error, stdout, stderr) => {
                    if (error !== null) {
                        reject(error);
                    } else {
                        resolve()
                    }
                });
        } catch(e){
            reject(e);
        }
    });

}

function getPackageAbsolutePath(pkgName){
    return path.dirname(require.resolve(`${pkgName}/package.json`))
}

const pkgName = 'react-bootstrap';
const wrongPkgName = 'react-bootstrap-s';

console.log(getPackageAbsolutePath(pkgName));
console.log(getPackageAbsolutePath(wrongPkgName));
