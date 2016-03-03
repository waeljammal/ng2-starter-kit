var path = require('path');

module.exports = function() {
    /********************************************************/
    /* PATHS
    /********************************************************/
    
    // The applications root path
    var rootPath    = '';
    // The client folder
    var clientPath  = path.join(__dirname, 'client')  + '/';
    // The server folder
    var serverPath  = path.join(__dirname, 'server')  + '/';
    // The output folder
    var buildPath   = path.join(__dirname, 'target')  + '/';
    // The root assets folder
    var assetsPath  = path.join(clientPath, 'assets') + '/';
    // The public index file
    var index       = path.join(clientPath, 'index.html');
    // Full path to node_modules
    var modules     = path.join(__dirname, 'node_modules') + '/';
    // Full path to vendor folder
    var vendor      = path.join(__dirname, 'vendor') + '/';
    // Folder name where all compiled files end up in under the build path
    var resources   = 'resources';
    
    // Exposed paths to source folders
    var inputPaths  = {
        root        : rootPath,
        vendor      : rootPath   + 'vendor/',
        client      : clientPath,
        components  : clientPath + 'components/',
        containers  : clientPath + 'containers/',
        composites  : clientPath + 'components-composite/',
        common      : clientPath + 'common/',
        fixtures    : clientPath + 'common/fixtures/',
        assets      : assetsPath,
        images      : assetsPath + 'images/',
        lib         : assetsPath + 'lib/',
        fonts       : assetsPath + 'fonts/',
        styles      : assetsPath + 'styles/'
    };

    // Exposed paths used when storing compiled output
    var outputPaths  = {
        root        : rootPath,
        build       : buildPath,
        cache       : rootPath  + 'gulp/.cache/',
        reports     : buildPath + 'reports/',
        resources   : buildPath + 'resources/'
    };

    /********************************************************/
    /* COMPILATION
    /********************************************************/

    // The data used to generate the common dll
    var dll          = {
        // File containing all the require's
        source      : clientPath + 'common.ts',
        // Location to store the dll in
        outputPath  : assetsPath + 'lib',
        // Can be false, source-map, eval, cheap-source-map, inline-source-map
        sourceMap   : 'cheap-source-map',
        // True if you want to mangle it, might not work for very large libraries
        mangle      : false
    };
    
    // Set to production for release
    var environment  = 'development';
    
    // Application files to compile
    var tsFiles     = [
        clientPath + '**/!(*.spec)+(.ts)'
    ];

    // Test files to compile
    var tsTestFiles = [
        clientPath + '**/*.spec.ts',
        clientPath + '**/*-testing.ts'
    ];
    
    /********************************************************/
    /* FILE WATCHERS
    /********************************************************/
    
    // Watch files and copy them when they change
    // - destination
    // -- Relative to the outputPaths.build path
    var copyWatchers = [
        // Copy all fonts & css files from the client folder
        {
            watch: [
                inputPaths.assets + '**/*.js',
                inputPaths.assets + '**/*.gz',
                inputPaths.assets + '**/*.map',
                inputPaths.assets + '**/*.css',
                inputPaths.assets + '**/*.eot',
                inputPaths.assets + '**/*.svg',
                inputPaths.assets + '**/*.ttf',
                inputPaths.assets + '**/*.woff2',
                inputPaths.assets + '**/*.woff',
                inputPaths.assets + '**/*.png',
                inputPaths.assets + '**/*.jpg'
            ],
            destination: 'assets'
        },
        // Copy all images that are stored in component folders
        {
            watch: [
                clientPath        + '**/*.png',
                clientPath        + '**/*.jpg'
            ],
            destination: ''
        }
    ];

    // Watch SASS & CSS files and copy/merge them when they change
    // - destination
    // -- Relative to the outputPaths.build path
    var sassWatchers = {
        destination: 'assets/styles',
        main: inputPaths.styles,
        // This list will have uncss run against it in order to strip out whats not used.
        includesStripped: [
            
        ],
        // This list is only minified and merged
        includes: [
            inputPaths.styles       + 'main.scss',
            inputPaths.components   + '**/*.scss',
            inputPaths.containers   + '**/*.scss',
            inputPaths.composites   + '**/*.scss'
        ],
        watch: [
            inputPaths.client       + '**/*.scss'
        ]
    };

    // Files that browser sync will watch and reload when a change is detected
    var syncWatchers = [
        buildPath       + '**.html',
        buildPath       + '**/**.html',
        buildPath       + '**/**.css',
        '!' + buildPath + 'index.html',
        '!' + buildPath + 'reports/**',
        buildPath       + 'resources/common-manifest.json'
    ];

    /********************************************************/
    /* FILE CLEANUP
    /********************************************************/

    // Expressions used for cleaning up files generated for unit testing, 
    // used in the test-clean task.
    var cleanTest    = [
        clientPath              + '*.js',
        clientPath              + '*.js.map',
        inputPaths.components   + '**/*.js',
        inputPaths.components   + '**/*.js.map',
        inputPaths.containers   + '**/*.js',
        inputPaths.containers   + '**/*.js.map',
        inputPaths.common       + '**/*.js',
        inputPaths.common       + '**/*.js.map',
        inputPaths.composites   + '**/*.js',
        inputPaths.composites   + '**/*.js.map'
    ];

    // Expressions used for cleaning up, used in the clean task.
    // includes all the cleanTest paths
    var cleanPaths   = [
        outputPaths.build       + '**/*',
        outputPaths.cache       + '*.*'
    ].concat(cleanTest);
    
    /********************************************************/
    /* LOGGING
    /********************************************************/

    // What compiler stats to show.
    var stats       = {
        // With console colors
        colors: true,
        // add the hash of the compilation
        hash: false,
        // add webpack version information
        version: false,
        // add timing information
        timings: true,
        // add assets information
        assets: false,
        // add chunk information
        chunks: true,
        // add built modules information to chunk information
        chunkModules: false,
        // add built modules information
        modules: false,
        // add also information about cached (not built) modules
        cached: true,
        // add information about the reasons why modules are included
        reasons: true,
        // add the source code of modules
        source: true,
        // add details to errors (like resolving log)
        errorDetails: true,
        // add the origins of chunks and chunk merging info
        chunkOrigins: false,
        // Add messages from child loaders
        children: true
    };

    /********************************************************/
    /* OPTIMIZATION
     /********************************************************/

    //Minification compression settings
    var compress    = {
        warnings: false,
        screw_ie8: true,
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        comparisons: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        drop_console: true
    };

    /********************************************************/
    /* ALIASES
    /********************************************************/

    // Aliases can be used with require to load external libraries
    // Only add entries here if simply using require('ace') for instance
    // wont work, you can use these to point the require to the correct path.
    // Example: 'jquery': modules + 'jquery/dist/jquery.min.js'
    var aliases     = {
        
    };
    
    // Modules that webpack should not parse
    var noParse     = [
        
    ];

    /********************************************************/
    /* CONFIGURATION EXPORTS
    /********************************************************/

    var config       = {
        rootPath     : rootPath,
        clientPath   : clientPath,
        assetsPath   : assetsPath,
        inputPaths   : inputPaths,
        buildPath    : buildPath,
        outputPaths  : outputPaths,
        index        : index,
        tsFiles      : tsFiles,
        tsTestFiles  : tsTestFiles,
        copyWatchers : copyWatchers,
        sassWatchers : sassWatchers,
        stats        : stats,
        compress     : compress,
        syncWatchers : syncWatchers,
        aliases      : aliases,
        resources    : resources,
        noParse      : noParse,
        environment  : environment,
        dll          : dll,
        cleanPaths   : cleanPaths,
        cleanTest    : cleanTest
    };

    return config;
};
