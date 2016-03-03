/* eslint-disable */
var gulp = require('gulp');
var config = require('../../gulp.config')();

gulp.task('copy', function() {
    var copyWatchers = config.copyWatchers;
    var stream = require('merge-stream')();

    for (var index in copyWatchers) {
        var watcher = copyWatchers[index];
        
        // noinspection JSUnresolvedFunction
        stream.add(gulp.src(watcher.watch).pipe(
            gulp.dest(config.buildPath + watcher.destination)
        ));
    }

    return stream;
});