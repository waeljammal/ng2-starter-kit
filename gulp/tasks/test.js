/**
 * Created by Wael on 12/10/2015.
 */
var gulp = require('gulp');
var Server = require('karma').Server;
var yargs = require('yargs');
var config = require('../../gulp.config')();
var webpack = require('webpack');
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
var path = require('path');
var del = require('del');
var gulpSequence = require('gulp-sequence');
var _ = require('../util/util');
var state = require('../util/state');

gulp.task('test', function(done) {
    state.coverage = yargs.argv.coverage || state.coverage;
    state.tap = yargs.argv.tap || state.tap;
    state.once = yargs.argv.once || state.once;
    
    if (state.tdd && !state.once && !yargs.argv.ts) {
        gulpSequence(
            ['test-clean'],
            ['tsc'],
            ['tsc-watch'],
            ['test-run-karma']
        )(done);
    }
    else if(yargs.argv.ts) {
        gulpSequence(
            ['test-clean'],
            ['test-run-karma']
        )(done);
    }
    else {
        if(state.tap) {
            state.browser = 'PhantomJS2';
        }
        
        gulpSequence(
            ['test-clean'],
            ['tsc'],
            ['test-run-karma']
        )(done);
    }
});

/**
 * Run tests
 */
gulp.task('test-run-karma', function(done) {
    var started = false;

    var newConfig = {
        configFile: __dirname + '/../../karma.conf.js',
        singleRun: yargs.argv.once || !state.tdd,
        browsers: [state.browser],
        coverage: state.coverage,
        reporters: state.tap ? ['tap'] : ['dots'],
        autoWatch: state.tdd,
        ts: yargs.argv.ts || state.ts
    };
    
    if(state.coverage) {
        newConfig.reporters.push('coverage');
    }
    
    var server = new Server(newConfig, function(karmaExitStatus) {
        started = true;
    });

    server.on('run_complete', function(browser) {
        if (newConfig.coverage) {
            setTimeout(function() {
                remapCoverage(function() {
                    if (!state.tdd || yargs.argv.once) {
                        if (state.build || yargs.argv.once || !state.tdd) {
                            cleanUpAppFolders(function() {
                                done();
                                //process.exit();
                            });
                        }
                        else {
                            done();
                        }
                    }
                });
            }, 100);
        }
        else {
            if (!state.build && !state.tdd || yargs.argv.once) {
                cleanUpAppFolders(function() {
                    //process.exit();
                    done();
                });
            }
            else if (!state.tdd) {
                done();
            }
        }
    });

    server.start();
});

/**
 * Clean up test files
 */
gulp.task('test-clean', function(done) {
    del(config.cleanTest, {}, done);
});

/**
 * Remap code coverage to typescript
 */
function remapCoverage(done) {
    // console.log('Remapping coverage to TypeScript format...');
    gulp.src(path.join(__dirname, '../../', 'target/reports/report-json/coverage-final.json'))
        .pipe(remapIstanbul({
            reports: {
                'html': path.join(__dirname + '/../../', 'target/reports/report-html')
            }
        }))
        .on('finish', function() {
            // console.log('Remapping done! ' + path.join(__dirname + '/../../', 'target/reports/report-html'));
            done();
        });
}

/**
 * Clean up test files
 */
function cleanUpAppFolders(done) {
    del(config.cleanTest, {}, done);
}