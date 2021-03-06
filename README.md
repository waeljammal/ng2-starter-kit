- Setup
    - npm install -g browser-sync
    - npm install
    
- Concepts
    - components
        - Reusable components
        - Do not use services
        - Use Data In / Event Out
    - components-composite
        - Compose components from re-usable components
        - Can use services and application specific business logic
        - Can be used in multiple containers
    - containers
        - These are your routables
        - Can use components and composite-components
        
- Features
    - Webpack
    - CommonJS
    - Typescript
    - Browser Sync
    - SASS
    - DLL's
    - Linting
    - Fast incremental compilation
    - CSS Stripping
    - Centralized configuration in gulp.config.js
    - Karma / Sinon / Mocha / Chai unit testing
    - Docker Build
    - Typescript code coverage
    
> Makes use of DLL's, this both speeds up page loading time and reduces both the
> initial build and rebuild time. These DLL's take a little while to build but are 
> optimized and minified.

> You should run ***gulp dll*** anytime you add a new library in *client/common.ts* so that your new 
> library can be included in the DLL.

> Use require.include if you want to bundle your script but not run it when the dll loads you
> can initialize it later by calling require('library-name')

- **Note**: When running test you can prevent js and maps from being generated by 
using --ts however don't use --ts with --coverage or you will get no source map support in your coverage.

- To run in production mode without tests (fastest build time)
    - gulp

- To build for production
    - gulp build
    
- To run in dev mode with tests (slower build time)
    - gulp --test
    - gulp --test --coverage
    - gulp --test --coverage --browser Chrome (default is PhantomJS2)

- To run tests once
    - gulp test
    - gulp test --once
    - gulp test --once --coverage
    - gulp test --once --coverage --tap

- To analyze the size and the dependencies: 
    - webpack --config webpack.prod.config --profile --json > webpack-profile.json
    - then upload the file here http://webpack.github.io/analyse/
    
- Authors
    - Wael Jammal (wael@rsnewmedia.co.uk)