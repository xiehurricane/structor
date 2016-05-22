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
import webpack from 'webpack';
import * as config from '../commons/configuration.js';

let compiler = undefined;

function compile(entryFilePath, outputDirPath, outputFileName) {
    return new Promise((resolve, reject) => {
        if(!compiler){
            try{
                let webpackConfig = require(config.webpackConfigFilePath())({
                    deskEntryPoint: entryFilePath,
                    deskEntryPointFilePath: '',
                    deskEntryPointOutputPath: outputDirPath,
                    deskEntryPointOutputFileName: outputFileName,
                    deskEntryPointOutputPublicPath: '',
                    nodeModulesDirPath: config.nodeModulesDirPath(),
                    serverNodeModulesDirPath: config.serverNodeModulesDirPath()
                });
                webpackConfig.entry = [entryFilePath];
                webpackConfig.output = {
                    path: outputDirPath,
                    filename: outputFileName
                };
                compiler = webpack(webpackConfig);
                if(config.getDebugMode()){
                    console.log('Webpack configuration:');
                    console.log(JSON.stringify(webpackConfig, null, 4));
                }
            } catch(e){
                throw Error('Webpack config was not found. ' + e);
            }
        }
        compiler.run((err, stats) => {
            let jsonStats = stats.toJson({
                hash: true
            });
            //console.log(jsonStats.hash);
            //let lastWatcherHash = jsonStats.hash;
            //if(jsonStats.errors.length > 0)
            //    console.log(jsonStats.errors);
            //if(jsonStats.warnings.length > 0)
            //    console.log(jsonStats.warnings);
            //console.log(stats);
            if (err) {
                reject(err);
            } else if (jsonStats.errors.length > 0) {
                //let messages = [];
                //_.each(jsonStats.errors, (item) => {
                //    let messageArray = item.split('\n');
                //    //console.log('Error message: ' + messageArray);
                //    messages.push(messageArray);
                //});
                //console.log(jsonStats.errors);
                reject(jsonStats.errors);
            } else {
                resolve();
            }
        });

    });
}

export function compileWorkingCopy(){
    const entryFilePath = path.join(config.sandboxDirPath(), 'work', '.structor', 'src', 'default.js');
    const outputDirPath = path.join(config.sandboxDirPath(), 'work', '.structor', 'desk');
    const outputFileName = 'bundle.js';
    return compile(entryFilePath, outputDirPath, outputFileName);

}
