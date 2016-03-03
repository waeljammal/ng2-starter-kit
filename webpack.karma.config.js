var webpack = require('webpack');
var path = require('path');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var client = path.join(__dirname, 'client');
var node_modules = path.join(__dirname, 'node_modules');
var vendor = path.join(__dirname, 'vendor');
var settings = require('./gulp.config')();

module.exports = function(coverage) {
    var config = {
        debug: true,
        cache: true,
        module: {
            noParse: [
                /zone\.js\/dist\/.+/,
                /angular2\/bundles\/.+/
            ],
            loaders: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    query: {
                        'ignoreDiagnostics': [
                            2403, // 2403 -> Subsequent variable declarations
                            2300, // 2300 -> Duplicate identifier
                            2374, // 2374 -> Duplicate number index signature
                            2375  // 2375 -> Duplicate string index signature
                        ],
                        'transpileOnly': true,
                        'isolatedModules': true
                    },
                    exclude: [ /node_modules\/(?!(ng2-.+))/ ]
                },
                {
                    test: /\.html$/,
                    loader: 'raw',
                    exclude: [
                        path.resolve(__dirname, '.awcache'),
                        path.resolve(__dirname, 'vendor'),
                        path.resolve(__dirname, 'node_modules'),
                        path.resolve(__dirname, 'bower_components')
                    ]
                }
            ]
        },
        stats: {colors: true, reasons: true},
        resolve: {
            alias: settings.aliases,
            extensions: ['', '.js', '.ts'],
            modulesDirectories: ['node_modules', 'client', 'target']
        },
        plugins: [
            // Dll references
            new webpack.DllReferencePlugin({
                context: path.join(__dirname, './'),
                manifest: require('./client/assets/lib/common-manifest.json')
            })
        ]
    };

    if (coverage) {
        config.module.postLoaders = [
            {
                test: /\.(js)$/,
                loader: 'istanbul-instrumenter-loader',
                exclude: [
                    /\.spec\.js$/,
                    /test\.js$/,
                    /testing/,
                    /node_modules/
                ]
            }
        ]
    }
    else {
        config.devtool = 'inline-source-map';
        config.module.preLoaders = [
            {
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    }

    return config;
};