/**
 * Created by Wael on 08/11/2015.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var config = require('../../gulp.config')();
var uncss = require('gulp-uncss');
var stripCssComments = require('gulp-strip-css-comments');
var gulpSequence = require('gulp-sequence');
var _ = require('../util/util');

/* Default task */
gulp.task('sass', function(done) {
    gulpSequence(
        ['sass-vendor'],
        ['sass-client'],
        ['sass-merge'],
        _.runCallback(done)
    );
});

/**
 * In dev mode we do not uncss because it's slow
 * we simply concat and compile
 */
gulp.task('sass-dev', function() {
    var watchers = config.sassWatchers;

    return gulp.src(watchers.includesStripped.concat(watchers.includes))
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [
                config.clientPath,
                config.assetsPath,
                config.inputPaths.styles
            ]
        }).on('error', sass.logError))
        .pipe(concat('style-sheet.css'))
        .pipe(gulp.dest(config.buildPath + watchers.destination));
});

/**
 * Used when merging vendor + client css
 */
gulp.task('sass-merge', function() {
    var watchers = config.sassWatchers;

    return gulp.src([
            config.outputPaths.cache + 'style-sheet-vendor.css',
            config.outputPaths.cache + 'style-sheet-client.css'
        ])
        .pipe(concat('style-sheet.css'))
        .pipe(gulp.dest(config.buildPath + watchers.destination));
});

/**
 * Outputs the client style sheet
 */
gulp.task('sass-client', function() {
    var watchers = config.sassWatchers;

    return gulp.src(watchers.includes)
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [
                config.clientPath,
                config.assetsPath,
                config.inputPaths.styles
            ]
        }).on('error', sass.logError))
        .pipe(concat('style-sheet-client.css'))
        
        .pipe(gulp.dest(config.outputPaths.cache));
});

/**
 * Outputs optimized vendor stylesheet
 */
gulp.task('sass-vendor', function() {
    var watchers = config.sassWatchers;

    return gulp.src(watchers.includesStripped)
        .pipe(sass({
            outputStyle: 'nested',
            includePaths: [
                config.clientPath,
                config.assetsPath,
                config.inputPaths.styles
            ]
        }).on('error', sass.logError))
        .pipe(concat('style-sheet-vendor.css'))
        .pipe(uncss({
            html: [
                //config.inputPaths.client + 'index.html',
                config.inputPaths.components + '**/*.html',
                config.inputPaths.containers + '**/*.html',
                config.inputPaths.composites + '**/*.html'
            ],
            report: true,
            ignore: [
                '.active',
                '.visible',
                '.iconic',
                '.icon',
                ':hover'
            ]
        }))
        .pipe(gulp.dest(config.outputPaths.cache));
});