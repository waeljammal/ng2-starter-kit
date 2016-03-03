var gulp = require('gulp');
var uglify = require('gulp-uglify');
var path = require('path');
var gzip = require('gulp-gzip');
var gutil = require('gulp-util');
var webpack = require('webpack');
var gulpSequence = require('gulp-sequence');
var config = require('../../gulp.config')();
var _ = require('../util/util');
var state = require('../util/state');

gulp.task('build', function(done) {
    state.tdd = false;
    state.coverage = true;
    state.build = true;
    state.tap = true;
    state.browser = 'PhantomJS2';
    
    config.environment = 'production';

    gulpSequence(
        ['clean'],
        ['dll'],
        ['build-webpack'],
        ['sass'],
        ['copy'],
        ['build-gzip'],
        ['test']
    )(done);
});

gulp.task('build-webpack', function(callback) {
    var webpackConfig = require('../../webpack.prod.config');
    var myConfig = Object.create(webpackConfig);

    webpackConfig.module.loaders[0].transpileOnly = false;
    
    // run webpack
    webpack(myConfig, function(err, stats) {
        if (err) throw new gutil.PluginError('build-webpack', err);
        gutil.log('[webpack:build]', stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('build-bundle-compress', function(done) {
    var fs = require('fs');
    var lastValid = '';
    var stream;
    
    fs.readdir(path.join(__dirname, '../../', config.resourcesOutputPath), function(err, files) {
        if (err) throw err;
        files.forEach(function(file) {
            if (_.endsWith(file, '.js')) {
                fs.exists(path.join('target', 'resources', file.replace('.js', '.js.map')), function(exists) {
                    if (exists) {
                        stream = gulp.src(path.join('target', 'resources', file))
                            .pipe(uglify(file, {
                                exclude: ['tasks'],
                                ignoreFiles: ['.combo.js', '-min.js', '.min.js'],
                                mangle: false,
                                warnings: false,
                                compress: config.compress,
                                outSourceMap: true,
                                preserveComments: false
                            }))
                            .pipe(gulp.dest(path.join('target', 'resources')));

                        stream.on('end', function() {
                            if (file === lastValid) {
                                done();
                            }
                        });
                    }
                    else {
                        stream = gulp.src(path.join('target', 'resources', file))
                            .pipe(uglify(file, {
                                exclude: ['tasks'],
                                ignoreFiles: ['.combo.js', '-min.js', '.min.js'],
                                mangle: false,
                                warnings: false,
                                compress: config.compress,
                                preserveComments: false
                            }))
                            .pipe(gulp.dest(path.join('target', 'resources')));

                        stream.on('end', function() {
                            if (file === lastValid) {
                                done();
                            }
                        });
                    }
                    
                    lastValid = file;
                });
            }
        });
    });
});

gulp.task('build-gzip', function() {
    var targetPath = path.join('target', 'resources');
    return gulp.src([
        path.join(targetPath, '*.js'), 
        path.join(targetPath, '*.js.map'), 
        path.join(targetPath, '**', '*.js')
    ])
        .pipe(gzip())
        .pipe(gulp.dest(targetPath));
});

