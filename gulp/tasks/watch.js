/* eslint-disable */
var gulp = require('gulp');
var config = require('../../gulp.config')();
var watch = require('gulp-watch');
var batch = require('gulp-batch');

gulp.task('watch', function(done) {
    var copyWatchers = config.copyWatchers;
    var sassWatchers = config.sassWatchers;

    // Creates file watchers
    for (var watcher of copyWatchers) {
        createWatcher(watcher);
    }

    watch(sassWatchers.watch, {
        verbose: true,
        awaitWriteFinish: {
            stabilityThreshold: 700,
            pollInterval: 500
        },
        useFsEvents: true
    }, function() {
        gulp.start('sass-dev');
    });

    done();
});

function createWatcher(watcher) {
    var target = config.buildPath + watcher.destination;

    if (watcher.once) {
        gulp.src(watcher.watch).pipe(gulp.dest(target));
    }
    else {
        watch(watcher.watch, {
            verbose: false,
            awaitWriteFinish: {
                stabilityThreshold: 700,
                pollInterval: 500
            },
            useFsEvents: true
        }, batch(function(events, done) {
            console.log('[' + file.type + ']: copy ' + file.path + ' > ' + target);
            gulp.src(watcher.watch).pipe(gulp.dest(target));
        }));
    }
}