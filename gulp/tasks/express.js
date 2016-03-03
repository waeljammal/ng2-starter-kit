/**
 * Created by Wael on 02/12/2015.
 */
var gulp = require('gulp');
var server = require('gulp-express');
var watch = require('gulp-watch');

gulp.task('express', ['watch-express', 'start-express']);

gulp.task('watch-express', function() {
    watch(['server/server.js', 'server/**/*.js'], {
        verbose: true,
        awaitWriteFinish: {
            stabilityThreshold: 700,
            pollInterval: 500
        },
        useFsEvents: true
    }, function() {
        gulp.start('start-express');
    });
});

gulp.task('start-express', function() {
    server.run(['server/server.js']);
});