var gulp = require('gulp');
var path = require('path');
var gutil = require('gulp-util');
var webpack = require('webpack');
var gulpSequence = require('gulp-sequence');
var del = require('del');
var CompressionPlugin = require('compression-webpack-plugin');
var DefinePlugin  = require('webpack/lib/DefinePlugin');
var config = require('../../gulp.config')();

gulp.task('dll', function(done) {
    gulpSequence(
        ['dll-clean'],
        ['dll-vendor']
    )(done);
});

gulp.task('dll-clean', function() {
    return del([
        path.join(config.dll.outputPath, '*.js*'),
        path.join(config.dll.outputPath, '*.json')
    ]);
});

gulp.task('dll-vendor', function(done) {
    var myConfig = Object.create(require('../config/webpack.config.template'));
    myConfig.output.filename = 'common.js';
    myConfig.output.library = 'common';
    myConfig.output.libraryTarget = 'var';
    myConfig.devtool = config.dll.sourceMap;
    myConfig.output.path = config.dll.outputPath;
    myConfig.entry.vendor = [
        config.dll.source
    ];

    myConfig.plugins = [
        new webpack.DllPlugin({
            path: path.join(config.dll.outputPath, 'common-manifest.json'),
            name: 'common'
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: config.compress,
            mangle: false
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        }),
        new CompressionPlugin({
            asset: '{file}.gz',
            algorithm: 'gzip',
            minRatio: 0.8
        }),
        new DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(config.environment),
                'NODE_ENV': JSON.stringify(config.environment)
            }
        })
    ];

    // run webpack
    webpack(myConfig, function(err, stats) {
        if (err) throw new gutil.PluginError('build-webpack', err);
        gutil.log('[webpack:build]', stats.toString({
            colors: true
        }));
        done();
    });
});