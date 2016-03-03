var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var path = require('path');
var yargs = require('yargs');
var _ = require('../util/util');
var compress = require('compression');
var config = require('../../gulp.config')();
var browserSync = require('browser-sync');
var bs1 = browserSync.create('dev');
var CachePlugin = require("webpack/lib/CachePlugin");
var gulpSequence = require('gulp-sequence');
var state = require('../util/state');

gulp.task('dev', function(done) {
    if(yargs.argv.test) {
        state.tdd = true;
        state.coverage = yargs.argv.coverage !== undefined;
        state.build = false;
        state.tap = false;
        state.browser = yargs.argv.browser || 'PhantomJS2';
        config.environment = 'development';

        gulpSequence(
            ['dev-build'],
            ['sass-dev'],
            ['copy'],
            ['dev-browser-sync', 'test'],
            _.runCallback(done)
        );
    }
    else {
        gulpSequence(
            ['dev-build'],
            ['sass-dev'],
            ['copy'],
            ['dev-browser-sync'],
            _.runCallback(done)
        ); 
    }
});

/**
 * Browser Sync
 */
// noinspection JSUnresolvedFunction
gulp.task('dev-browser-sync', function(done) {
    bs1.init({
        port: 3000,
        open: false,
        reloadDelay: 100,
        reloadDebounce: 100,
        online: true,
        minify: false,
        notify: true,
        logFileChanges: true,
        reloadOnRestart: true,
        server: {
            baseDir: 'target',
            index: 'index.html',
            middleware: function(req, res, next) {
                var gzip = compress();
                gzip(req, res, next);
            }
        },
        files: config.syncWatchers
    });
});

/**
 * Builds the client bundle
 */
// noinspection JSUnresolvedFunction
gulp.task('dev-build', function(done) {
    var webpackConfig;
    var cache = {};
    var env = yargs.argv.env != undefined ? yargs.argv.env : 'dev';

    webpackConfig = require('../../webpack.' + env + '.config');
    
    var myConfig = Object.create(webpackConfig);
    myConfig.cache = cache;
    myConfig.watch = true;
    myConfig.hot = false;

    var bundler = webpack(myConfig);
    var started = false;
    var assets = {};

    function bundle(err, stats) {
        if (err) {
            throw new gutil.PluginError('build:webpack', err);
        }

        gutil.log('[build:webpack]', stats.toString(config.stats));

        var changedFiles = [];

        _.forEach(stats.compilation.assets, function(asset, assetName) {
            var previousAssetContents = assets[assetName];
            var assetContents = getAssetContents(asset);
            var assetHasChanged = !_.isEqual(previousAssetContents, assetContents);

            if (assetHasChanged) {
                if (assetName.indexOf('.js') > -1) {
                    changedFiles.push(assetName);
                }
            }

            assets[assetName] = assetContents;
        });

        if (changedFiles.length > 0) {
            bs1.reload();
        }

        if (!started) {
            started = true;
            return done();
        }
    }

    bundler.watch(500, bundle);
});

/**
 * Returns assets list
 *
 * @param asset
 * @returns {*}
 */
function getAssetContents(asset) {
    var contents = null;

    if (asset._value) {
        contents = asset._value;
    }
    else if (asset.children) {
        contents = asset.children;
    }
    else if (asset['_cachedSource']) {
        contents = asset['_cachedSource'];
    }

    return contents;
}