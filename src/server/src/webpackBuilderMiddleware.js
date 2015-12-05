
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

module.exports = function webpackBuilderMiddleware(compiler, opts){

    compiler.plugin('done', stats => {
        if(opts.callback){
            stats = stats.toJson();
            //console.log('Compiler done: ' + JSON.stringify(stats, null, 4));
            opts.callback({
                status: 'done',
                time: stats.time,
                hash: stats.hash,
                warnings: stats.warnings,
                errors: stats.errors
            });
        }
    });

    compiler.plugin('compilation', (c, params) => {
        //console.log('Compiler start compilation');
        if(opts.callback){
            opts.callback({ status: 'start' });
        }
    });


    return function(req, res, next) {
        return next();
    };

};
