var webpack = require('webpack');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DefinePlugin  = require('webpack/lib/DefinePlugin');
var settings = require('./gulp.config')();
var WebpackConfig = require('webpack-config');

module.exports = new WebpackConfig().extend('./webpack.config.js').merge({
    entry: {
        'vendor': ['./client/common.ts'],
        'client': './client/index.ts'
    },
    debug: true,
    watch: true,
    hot: false,
    output: {
        filename: '[name].js',
        path: settings.outputPaths.resources,
        publicPath: '/' + settings.resources + '/',
        pathinfo: false,
        library: ['client', '[name]'],
        chunkFilename: '[name].js'
    },
    plugins: [
        new CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js',
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            template: 'client/index.html',
            inject: false,
            filename: '../index.html'
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].js.map',
            exclude: [
                'bootstrap-colorpicker', 'ace'
            ]
        })
    ]
});