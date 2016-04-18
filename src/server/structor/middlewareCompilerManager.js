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
import * as config from '../commons/configuration.js';

let compiler = undefined;
let devMiddleware = undefined;
let hotMiddleware = undefined;
let builderMiddleware = undefined;

export function getDevMiddlewareCompiler() {
    if (compiler === undefined) {
        let configPart;
        try{
            configPart = require(config.webpackConfigFilePath());
        } catch(e){
            console.warn('Webpack loaders custom config was not found');
        }
        configPart = configPart || {};
        const webpackConfig = _.mergeWith({
                name: "browser",
                entry: [
                    'webpack-hot-middleware/client?path=/structor-desk/a&overlay=false',
                    config.deskEntryPointFilePath()
                ],
                output: {
                    path: path.join(config.deskDirPath(), '__build__'),
                    filename: 'bundle.js',
                    publicPath: '/structor-desk/__build__'
                },
                devtool: 'inline-source-map',
                plugins: [
                    new webpack.optimize.OccurenceOrderPlugin(),
                    new webpack.HotModuleReplacementPlugin(),
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
                                    [path.join(config.serverNodeModulesDirPath(), 'babel-plugin-react-transform'), {
                                        transforms: [{
                                            transform: path.join(config.serverNodeModulesDirPath(), 'react-transform-hmr'),
                                            imports: ["react"],
                                            locals: ["module"]
                                        }]
                                    }],
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
            });
        //console.log(JSON.stringify(webpackConfig, null, 4));

        compiler = webpack(webpackConfig);

    }
    return compiler;
}

export function getDevMiddleware() {
    if (devMiddleware === undefined) {
        devMiddleware = webpackDevMiddleware(
            getDevMiddlewareCompiler(),
            {
                noInfo: true,
                quiet: true,
                lazy: false,
                publicPath: '/structor-desk/__build__'
            }
        );
    }
    return devMiddleware;
}

export function getHotMiddleware() {
    if (hotMiddleware === undefined) {
        hotMiddleware = webpackHotMiddleware(
            getDevMiddlewareCompiler(),
            {
                log: console.log,
                path: '/structor-desk/a',
                heartbeat: 10 * 1000
            }
        );
    }
    return hotMiddleware;
}

export function getBuilderMiddleware(opts) {
    if (builderMiddleware === undefined) {
        builderMiddleware = webpackBuilderMiddleware(
            getDevMiddlewareCompiler(),
            opts
        );
    }
    return builderMiddleware;
}


