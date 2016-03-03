/// <reference path="./common/typings/webpack-env.d.ts" />

// Polyfills
import 'script!zone.js/dist/zone-microtask.min';
require('es7-reflect-metadata/dist/browser');

if ('production' !== process.env.ENV) {
    Error['stackTraceLimit'] = Infinity;
    Zone['longStackTraceZone'] = require('zone.js/dist/long-stack-trace-zone.min');
}

// RxJS
require.include('rxjs');

// Angular 2
require.include('angular2/core');
require.include('angular2/platform/browser');
require.include('angular2/platform/common_dom');
require.include('angular2/router');
require.include('angular2/http');