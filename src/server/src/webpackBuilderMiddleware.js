
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
