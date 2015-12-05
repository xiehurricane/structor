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
import webpack from 'webpack';
//import ExtractTextPlugin from "extract-text-webpack-plugin";

class ProjectCompiler {

    //static getDevMiddlewareCompiler(entryFilePath, outputDirPath, nodeModulesDir){
    //    let compiler = webpack({
    //        name: "browser",
    //        entry: [
    //            'webpack-hot-middleware/client?path=/desk/a',
    //            entryFilePath
    //        ],
    //        output: {
    //            path: path.join(outputDirPath, '__build__'),
    //            filename: 'bundle.js',
    //            publicPath: '/desk/__build__'
    //        },
    //        devtool: 'inline-source-map',
    //        plugins: [
    //            new webpack.optimize.OccurenceOrderPlugin(),
    //            new webpack.HotModuleReplacementPlugin(),
    //            new webpack.NoErrorsPlugin()
    //        ],
    //        module: {
    //            loaders: [
    //                { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel?cacheDirectory&stage=0' },
    //                { test: /\.css$/, exclude: /node_modules/, loader: "style-loader!css-loader" },
    //                { test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)([\?]?.*)$/, exclude: /node_modules/, loader: 'url-loader' }
    //            ]
    //        },
    //        resolveLoader: {
    //            root: [nodeModulesDir]
    //        },
    //        externals: {
    //            "jquery": "jQuery"
    //        }
    //    });
    //    return compiler
    //}

    compile(entryFilePath, outputDirPath, outputFileName, nodeModulesDir){
        return new Promise((resolve, reject) => {

            let compiler = webpack({
                name: "browser",
                entry: [entryFilePath],
                output: {
                    path: outputDirPath,
                    filename: outputFileName
                },
                debug: true,
                module: {
                    loaders: [
                        { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel?cacheDirectory&stage=0' },
                        { test: /\.css$/, exclude: /node_modules/, loader: "style-loader!css-loader" },
                        { test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)([\?]?.*)$/, exclude: /node_modules/, loader: 'url-loader' }
                    ]
                },
                //resolveLoader: { root: path.join(__dirname, "node_modules") },
                resolveLoader: {
                    root: [nodeModulesDir]
                },
                externals: {
                    // require("jquery") is external and available
                    //  on the global var jQuery
                    "jquery": "jQuery"
                }
            });
            compiler.run( (err, stats) => {
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
                if(err) {
                    reject(err);
                } else if(jsonStats.errors.length > 0){
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

    compileOptimized(entryFilePaths, outputDirPath, outputFileName, nodeModulesDir, isCommons = false){
        return new Promise((resolve, reject) => {

            var plugins = [
                //new ExtractTextPlugin("styles.css"),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                })
            ];
            if(isCommons){
                plugins.push(new webpack.optimize.CommonsChunkPlugin({ name: 'commons', filename: 'commons.js'}));
            }

            let compiler = webpack({
                name: "browser",
                entry: entryFilePaths,
                output: {
                    path: outputDirPath,
                    filename: outputFileName
                },
                debug: true,
                module: {
                    loaders: [
                        {test: /\.css$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract("style-loader", "css-loader?-autoprefixer") },
                        {test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)([\?]?.*)$/, exclude: /node_modules/, loader: 'url-loader'},
                        {test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel?cacheDirectory&stage=0'}
                    ]
                },
                plugins: plugins,
                //resolveLoader: { root: path.join(__dirname, "node_modules") },
                resolveLoader: {
                    root: [nodeModulesDir]
                },
                externals: {
                    // require("jquery") is external and available
                    //  on the global var jQuery
                    "jquery": "jQuery"
                }
            });
            compiler.run( (err, stats) => {
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
                if(err) {
                    reject(err);
                } else if(jsonStats.errors.length > 0){
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

    compileNotOptimized(entryFilePaths, outputDirPath, outputFileName, nodeModulesDir){
        return new Promise((resolve, reject) => {


            let compiler = webpack({
                name: "browser",
                entry: entryFilePaths,
                output: {
                    path: outputDirPath,
                    filename: outputFileName
                },
                debug: true,
                module: {
                    loaders: [
                        { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel?cacheDirectory&stage=0' },
                        { test: /\.css$/, exclude: /node_modules/, loader: "style-loader!css-loader" },
                        { test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)([\?]?.*)$/, exclude: /node_modules/, loader: 'url-loader' }
                    ]
                },
                //resolveLoader: { root: path.join(__dirname, "node_modules") },
                resolveLoader: {
                    root: [nodeModulesDir]
                },
                externals: {
                    // require("jquery") is external and available
                    //  on the global var jQuery
                    "jquery": "jQuery"
                }
            });
            compiler.run( (err, stats) => {
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
                if(err) {
                    reject(err);
                } else if(jsonStats.errors.length > 0){
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

    watchCompiler(entryFilePath, outputDirPath, outputFileName, nodeModulesDir, callback) {

        return new Promise((resolve, reject) => {

            let compiler = webpack({
                name: "browser",
                entry: [entryFilePath],
                output: {
                    path: outputDirPath,
                    filename: outputFileName
                },
                debug: true,
                module: {
                    loaders: [
                        {test: /\.css$/, exclude: /node_modules/, loader: "style-loader!css-loader"},
                        {test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)([\?]?.*)$/, exclude: /node_modules/, loader: 'url-loader'},
                        {test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel?cacheDirectory&stage=0'}
                    ]
                },
                //resolveLoader: { root: path.join(__dirname, "node_modules") },
                resolveLoader: {
                    root: [nodeModulesDir]
                },
                externals: {
                    // require("jquery") is external and available
                    //  on the global var jQuery
                    "jquery": "jQuery"
                }
            });

            let compiledProcessCount = 0;
            let processId = setTimeout( () => {
                this.watcher = compiler.watch(200, (err, stats) => {
                    var jsonStats = stats.toJson({
                        hash: true
                    });
                    //console.log(jsonStats.hash);
                    //if(jsonStats.errors.length > 0)
                    //    console.log(jsonStats.errors);
                    //if(jsonStats.warnings.length > 0)
                    //    console.log(jsonStats.warnings);
                    //console.log('compiled in ' + processId._idleStart);
                    if (err) {
                        //console.error(err);
                        callback([[err]]);
                    } else if (jsonStats.errors.length > 0) {
                        let messages = [];
                        _.each(jsonStats.errors, (item) => {
                            var messageArray = item.split('\n');
                            //console.log('Error message: ' + messageArray);
                            messages.push(messageArray);
                        });
                        //console.log(jsonStats.errors);
                        callback(messages);
                    } else {
                        if (this.lastWatcherHash !== jsonStats.hash) {
                            callback(null, {
                                compiledProcessCount: ++compiledProcessCount
                            });
                            //console.log("Called callback for socket.io emitter: " + compiledProcessCount);
                        }
                    }
                    this.lastWatcherHash = jsonStats.hash;
                });
            }, 1000);
            resolve();
        });

    }

    stopWatchCompiler() {
        return new Promise( (resolve, reject) => {
            if (this.watcher != null) {
                //console.log('Closing watcher');
                this.watcher.close();
                this.watcher = null;
                this.lastWatcherHash = null;
            }
            resolve();
        });
    }




}

export default ProjectCompiler;

