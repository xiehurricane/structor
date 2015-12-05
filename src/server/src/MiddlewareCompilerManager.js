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
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackBuilderMiddleware from './webpackBuilderMiddleware.js';


class MiddlewareCompilerManager {

    constructor(sm){
        this.sm = sm;
        this.compiler = null;
        this.devMiddleware = null;
        this.hotMiddleware = null;
        this.builderMiddleware = null;
    }

    getDevMiddlewareCompiler(){
        if(this.compiler === null){

            let configPart = require(this.sm.getProject('webpackConfig.filePath')) || {};
            //console.log(JSON.stringify(configPart, null, 4));
            const webpackConfig = _.merge({
                name: "browser",
                entry: [
                    'webpack-hot-middleware/client?path=/' + this.sm.getProject('desk.dirName') + '/a&overlay=false',
                    this.sm.getProject('projectEntryPoint.filePath')
                ],
                output: {
                    path: path.join(this.sm.getProject('desk.dirPath'), '__build__'),
                    filename: 'bundle.js',
                    publicPath: '/' + this.sm.getProject('desk.dirName') + '/__build__'
                },
                devtool: 'inline-source-map',
                plugins: [
                    new webpack.optimize.OccurenceOrderPlugin(),
                    new webpack.HotModuleReplacementPlugin(),
                    new webpack.NoErrorsPlugin()
                ],
                module: {
                    // todo: move babel-loader config elsewhere, but not in babelrc
                    loaders: [
                        {
                            test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel',
                            query: {
                                stage: 0,
                                plugins: [path.join(this.sm.getServer('nodeModules.dirPath'), 'babel-plugin-react-transform')],
                                extra: {
                                    "react-transform": {
                                        transforms: [{
                                            transform: path.join(this.sm.getServer('nodeModules.dirPath'), 'react-transform-hmr'),
                                            imports: ["react"],
                                            locals: ["module"]
                                        }]
                                    }
                                }
                            }
                        }
                    ]
                },
                resolve: {
                    root: [ this.sm.getServer('nodeModules.dirPath'), this.sm.getProject('nodeModules.dirPath') ]
                },
                resolveLoader: {
                    root: [ this.sm.getServer('nodeModules.dirPath'), this.sm.getProject('nodeModules.dirPath') ]
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
            });
            //console.log(JSON.stringify(webpackConfig, null, 4));

            this.compiler = webpack(webpackConfig);

        }
        return this.compiler;
    }

    getDevMiddleware(){
        if(this.devMiddleware === null){
            this.devMiddleware = webpackDevMiddleware(
                this.getDevMiddlewareCompiler(),
                {
                    noInfo: true,
                    quiet: true,
                    lazy: false,
                    publicPath: '/' + this.sm.getProject('desk.dirName') + '/__build__'
                }
            );
        }
        return this.devMiddleware;
    }

    getHotMiddleware(){
        if(this.hotMiddleware === null){
            this.hotMiddleware = webpackHotMiddleware(
                this.getDevMiddlewareCompiler(),
                {
                    log: console.log,
                    path: '/' + this.sm.getProject('desk.dirName') + '/a',
                    heartbeat: 10 * 1000
                }
            );
        }
        return this.hotMiddleware;
    }

    getBuilderMiddleware(opts){
        if(this.builderMiddleware === null){
            this.builderMiddleware = webpackBuilderMiddleware(
                this.getDevMiddlewareCompiler(),
                opts
            );
        }
        return this.builderMiddleware;
    }

}

export default MiddlewareCompilerManager;

