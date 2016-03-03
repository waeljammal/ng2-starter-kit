var path = require('path');
var client = path.join(__dirname, '../../', 'client');
var vendor = path.join(__dirname, '../../', 'vendor');
var node_modules = path.join(__dirname, '../../', 'node_modules');

var config = {
    entry: {
        vendor: [
            
        ]
    },
    output: {
        publicPath: '/assets/lib/',
        pathinfo: false,
        historyApiFallback: true
    },
    resolve: {
        alias: {
            
        },
        extensions: ['', '.ts', '.js'],
        modulesDirectories: ['node_modules', 'client']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                query: {
                    'ignoreDiagnostics': [
                        2403, // 2403 -> Subsequent variable declarations
                        2300, // 2300 -> Duplicate identifier
                        2374, // 2374 -> Duplicate number index signature
                        2375, // 2375 -> Duplicate string index signature
                        2339, // 2339 -> Declaration does not exist
                    ]
                },
                exclude: [ /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/ ]
            },
            {
                test: /\.html$/,
                loader: 'raw',
                exclude: [ /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/ ]
            },
            {test: /jquery\.js$/, loader: 'expose?jQuery'},
            {test: /jquery\.js$/, loader: 'expose?$'}
        ]
    },
    externals: {
        
    },
    plugins: [
        
    ]
};

module.exports = config;