var gulp = require('gulp');
var config = require('../../gulp.config')();
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var gcallback = require('gulp-callback')

/* Initialize TS Project */
var tsProject = ts.createProject(config.rootPath + 'tsconfig.json');
var tsUnitFiles = [].concat(config.tsTestFiles);
var tsFiles = [].concat(config.tsFiles, tsUnitFiles);

/* Watch changed typescripts file and compile it */
gulp.task('tsc-watch', function() {
    var done = false;
    return gulp.watch(tsFiles, function(file) {
        done = false;
        // console.log('Compiling ' + file.path + '...');
        return compileTs(file.path, true).pipe(gcallback(function() {
            if (!done) {
                done = true;
                // console.log('Finished Compiling ' + file.path + '...');
            }
        }));
    });
});

/* Compile typescripts */
gulp.task('tsc', function() {
    return compileTs(tsFiles);
});

gulp.task('tsc-app', function() {
    return compileTs(config.tsFiles);
});

gulp.task('tsc-unit', function() {
    return compileTs(tsUnitFiles);
});

function compileTs(files, watchMode) {
    var watchMode = watchMode || false;
    var outputPath = config.clientPath;
    var res = gulp.src(files)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .on('error', function() {
            process.exit(1);
        });

    if(watchMode) {
        var basePath = files.replace(path.join(__dirname, '../../'), '');
        outputPath = path.dirname(basePath);
    }

    return res.js.pipe(sourcemaps.write('.', {
            // Return relative source map root directories per file.
            includeContent: false,
            sourceRoot: function(file) {
                var sourceFile = path.join(file.cwd, file.sourceMap.file);
                return path.relative(path.dirname(sourceFile), file.cwd);
            }
        }))
        .pipe(gulp.dest(outputPath));
}

/* Lint typescripts */
gulp.task('tslint', function() {
    return lintTs(tsFiles);
});

gulp.task('tslint-app', function() {
    return lintTs(config.tsFiles);
});

gulp.task('tslint-unit', function() {
    return lintTs(tsUnitFiles);
});

function lintTs(files) {
    return gulp.src(files)
        .pipe(tslint())
        .pipe(tslint.report('prose', {
            summarizeFailureOutput: true
        }));
}