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
        module: {
            loaders: [
                { test: /\.js$/, exclude: /node_modules/, loader: 'babel',
                    query: {
                        presets: [
                            [
                                "es2015",
                                {
                                    "modules": false
                                }
                            ],
                            "react",
                            "stage-0"
                        ]
                    }
                },
                { test: /\.css$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract({fallbackLoader: 'style-loader', loader: 'css-loader'}) },
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

