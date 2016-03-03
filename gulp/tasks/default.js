var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var _ = require('../util/util');

/* Default task */
gulp.task('default', function(done) {
    gulpSequence(
        ['clean'],
        ['watch'],
        ['dev'],
        _.runCallback(done)
    );
});