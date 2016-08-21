var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = [
    {
        name: "browser",
        entry: {
            main: './src/application/main.js'
            //docs: './src/client/src/docs.js'
        },
        output: {
            // path: './static',
            path: '/Volumes/Development/projects/structor/structor-github-boilerplates/react-boilerplate/react-boilerplate/node_modules/structor/static',
            filename: '[name].js'
        },
        devtool: 'inline-source-map',
        debug: true,
        module: {
            loaders: [
                { test: /\.js$/, exclude: /node_modules/, loader: 'babel',
                    query: {
                        cacheDirectory: true,
                        presets: ['react', 'es2015-webpack', 'stage-0'],
                        plugins: ['transform-object-assign']
                    }
                },
                { test: /\.css$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
                { test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)([\?]?.*)$/, exclude: /node_modules/, loader: 'url-loader' }
            ]
        },
        plugins: [
            new ExtractTextPlugin("styles.css")
        ],
        externals: {
            "jquery": "jQuery"
        }
    }
];

