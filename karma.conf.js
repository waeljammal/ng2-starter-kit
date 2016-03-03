module.exports = function(config) {
    var settings = require('./gulp.config')();
    var path = require('path');
    var testWebpackConfig = require('./webpack.karma.config.js')(config.coverage);

    var setup = {
        basePath: '',
        frameworks: ['mocha', 'chai', 'tap', 'sinon', 'sinon-chai'],
        browsers: ['Chrome'],
        colors: true,
        client: {
            mocha: {
                reporter: 'html',
                ui: 'bdd'
            }
        },
        files: [],
        proxies: {
            // Proxy asset requests to the real assets folder
            '/assets/': settings.assetsPath
        },
        tapReporter: {
            outputFile: settings.outputPaths.reports +  'tap-report.tap'
        },
        reporters: ['dots', 'coverage'],
        webpack: testWebpackConfig,
        webpackMiddleware: {
            noInfo: true,
            stats: config.stats
        },
        mochaReporter: {
            colors: {
                success: 'blue'
            }
        },
        plugins: [
            require('karma-mocha-reporter'),
            require('karma-tap-reporter'),
            require('karma-coverage'),
            require('karma-webpack'),
            require('karma-tap'),
            require('karma-mocha'),
            require('karma-sinon'),
            require('karma-sinon-chai'),
            require('karma-chai'),
            require('karma-phantomjs2-launcher'),
            require('karma-spec-reporter'),
            require('karma-chrome-launcher'),
            require('karma-sourcemap-loader'),
            require('karma-phantomjs-shim')
        ],
        port: 9092,
        reportSlowerThan: 1000,
        captureTimeout: 90000,
        logLevel: config.LOG_INFO,
        singleRun: true
    };

    // Add coverage reports if needed
    if (config.coverage) {
        setup.coverageReporter = {
            dir: path.join('target', 'reports'),
            reporters: [
                {type: 'text-summary'},
                {type: 'json', subdir: 'report-json'}
            ]
        }
    }

    setup.files = setup.files.concat([
        // Angular 2 stuff
        'node_modules/traceur/bin/traceur-runtime.js',
        'node_modules/es7-reflect-metadata/dist/browser.min.js',
        'node_modules/reflect-metadata/Reflect.js',
        {pattern: 'node_modules/reflect-metadata/**/*.js.map', included: false, watched: false},
        {pattern: 'node_modules/angular2/**/*.js.map', included: false, watched: false},
        {pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false},

        // Assets
        {pattern: settings.clientPath + '**/*.png', watched: false, included: false, served: true, nocache: false},
        {pattern: settings.clientPath + '**/*.jpg', watched: false, included: false, served: true, nocache: false},
        
        // Common library
        {pattern: settings.inputPaths.lib + 'common.js.map', watched: false, included: false, served: true},
        {pattern: settings.inputPaths.lib + 'common.js', watched: false, included: true}
    ]);
    
    // If running with without --ts
    if (!config.ts) {
        setup.files = setup.files.concat([
            {pattern: settings.inputPaths.containers + '**/*.js', watched: false, included: false},
            {pattern: settings.inputPaths.components + '**/*.js', watched: false, included: false},
            {pattern: settings.inputPaths.common + '**/*.js', watched: false, included: false},
            {pattern: settings.clientPath + '**/*.js.map', watched: false, included: false},
            {pattern: settings.clientPath + '**/*.ts', watched: false, included: false},
            {pattern: settings.clientPath + '**/*.spec.js', watched: false}
        ]);

        var preprocessors = {};
        preprocessors[settings.clientPath + '**/*.spec.js'] = ['webpack', 'sourcemap'];
        setup.preprocessors = preprocessors;
    }
    // If running with --ts
    else {
        setup.files = setup.files.concat([
            {pattern: settings.inputPaths.containers + '**/*.ts', watched: false, included: false},
            {pattern: settings.inputPaths.components + '**/*.ts', watched: false, included: false},
            {pattern: settings.inputPaths.common + '**/*.ts', watched: false, included: false},
            {pattern: settings.clientPath + '**/*.spec.ts', watched: false}
        ]);

        var preprocessors = {};
        preprocessors[settings.clientPath + '**/*.spec.ts'] = ['webpack', 'sourcemap'];
        setup.preprocessors = preprocessors;
    }

    // noinspection JSUnresolvedFunction
    config.set(setup);
};