var webpack = require('webpack');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var WebpackConfig = require('webpack-config');
var settings = require('./gulp.config')();
var path = require('path');

module.exports = new WebpackConfig().extend('./webpack.dev.config.js').merge({
    entry: {
        'vendor': ['./client/common.ts'],
        'client': './client/index.ts'
    },
    bail: true,
    watch: false,
    debug: false,
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: settings.compress,
            mangle: false
        })
    ]
});