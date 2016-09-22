var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = [
    {
        name: "browser",
        entry: {
            main: './src/application/main.js',
            //docs: './src/client/src/docs.js',
        },
        output: {
            path: './static',
            filename: '[name].js'
        },
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
                        ],
                        plugins: [
                            "transform-react-remove-prop-types",
                            "transform-react-constant-elements",
                            "transform-object-assign"
                        ]
                    }
                },
                { test: /\.css$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract({fallbackLoader: 'style-loader', loader: 'css-loader'}) },
                { test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)([\?]?.*)$/, exclude: /node_modules/, loader: 'url-loader' }
            ]
        },
        plugins: [
            new webpack.optimize.OccurrenceOrderPlugin(true),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("production")
                }
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new ExtractTextPlugin("styles.css")
        ],
        externals: {
            "jquery": "jQuery"
        }
    }
];

