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

function compile(entryFilePath, outputDirPath, outputFileName) {
    return new Promise((resolve, reject) => {
        let configPart;
        try {
            configPart = require(config.webpackConfigFilePath());
        } catch (e) {
            console.warn('Webpack loaders custom config was not found');
        }
        configPart = configPart || {};
        let compiler = webpack(_.mergeWith({
                name: "browser",
                entry: [entryFilePath],
                output: {
                    path: outputDirPath,
                    filename: outputFileName
                },
                devtool: 'inline-source-map',
                plugins: [
                    new webpack.optimize.OccurenceOrderPlugin(),
                    new webpack.NoErrorsPlugin()
                ],
                module: {
                    loaders: [
                        {
                            test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel',
                            query: {
                                cacheDirectory: true,
                                presets: [
                                    path.join(config.serverNodeModulesDirPath(), 'babel-preset-react'),
                                    path.join(config.serverNodeModulesDirPath(), 'babel-preset-es2015'),
                                    path.join(config.serverNodeModulesDirPath(), 'babel-preset-stage-0')
                                ],
                                plugins: [
                                    [path.join(config.serverNodeModulesDirPath(), 'babel-plugin-transform-runtime')],
                                    [path.join(config.serverNodeModulesDirPath(), 'babel-plugin-add-module-exports')]
                                ]
                            }
                        }
                    ]
                },
                resolve: {
                    root: [config.serverNodeModulesDirPath(), config.nodeModulesDirPath()]
                },
                resolveLoader: {
                    root: [config.serverNodeModulesDirPath(), config.nodeModulesDirPath()]
                },
                externals: {
                    "jquery": "jQuery"
                }
            },
            configPart,
            (a, b) => {
                if (_.isArray(a)) {
                    return a.concat(b);
                }
            }));

        compiler.run((err, stats) => {
            let jsonStats = stats.toJson({
                hash: true
            });
            //console.log(jsonStats.hash);
            let lastWatcherHash = jsonStats.hash;
            //if(jsonStats.errors.length > 0)
            //    console.log(jsonStats.errors);
            //if(jsonStats.warnings.length > 0)
            //    console.log(jsonStats.warnings);
            //console.log(stats);
            if (err) {
                reject(err);
            } else if (jsonStats.errors.length > 0) {
                let messages = [];
                _.each(jsonStats.errors, (item) => {
                    let messageArray = item.split('\n');
                    //console.log('Error message: ' + messageArray);
                    messages.push(messageArray);
                });
                //console.log(jsonStats.errors);
                reject(messages);
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
