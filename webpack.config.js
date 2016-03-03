var path = require('path');
var webpack = require('webpack');
var WebpackConfig = require('webpack-config');
var node_modules = path.join(__dirname, 'node_modules');
var vendor = path.join(__dirname, 'vendor');
var DefinePlugin  = require('webpack/lib/DefinePlugin');
var settings = require('./gulp.config')();

var metadata = {
    title: 'NG2 Starter',
    baseUrl: '/',
    host: 'localhost',
    port: 3000
};

// noinspection JSUnresolvedFunction
var config = new WebpackConfig().merge({
    metadata: metadata,
    context: path.join(__dirname),
    bail: false,
    externals: {},
    module: {
        preLoaders: [
            {
                test: /\.ts$/,
                loader: "tslint",
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ]
            }
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
                exclude: [ /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/ ]
            },
            { 
                test: /\.async\.ts$/, 
                loaders: ['es6-promise-loader?global,[name]', 'ts-loader?transpileOnly=true&isolatedModules=true'], 
                exclude: [ /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/ ] 
            },
            {
                test: /\.html$/,
                loader: 'raw',
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ]
            }
        ],
        noParse: settings.noParse
    },
    eslint: {
        bail: false
    },
    resolve: {
        alias: settings.aliases,
        extensions: ['', '.ts', '.js'],
        modulesDirectories: ['node_modules', 'client']
    },
    plugins: [
        // Dll references
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, './'),
            manifest: require(settings.dll.outputPath + '/common-manifest.json')
        }),
        new DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(settings.environment),
                'NODE_ENV': JSON.stringify(settings.environment)
            }
        })
    ],
    node: {
        global: 'window',
        progress: false,
        crypto: 'empty',
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
});

module.exports = config;