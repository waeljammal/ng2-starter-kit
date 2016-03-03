import {provide, enableProdMode} from 'angular2/core';
import {bootstrap, ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {App} from './containers/app/App';

const ENV_PROVIDERS = [];

if ('production' === process.env.ENV) {
    enableProdMode();
} else {
    ENV_PROVIDERS.push(ELEMENT_PROBE_PROVIDERS);

    // The console.log does not work for the facade when 
    // loaded through a dll, so we delegate print here.
    const lang = require('angular2/src/facade/lang');
    lang.print = (value: any) => {
        console.log(value);
    };
}

/**
 * Bootstrap
 */
requestAnimationFrame(() => {
    bootstrap(<any> App, [
        ...ENV_PROVIDERS,
        ...HTTP_PROVIDERS,
        ...ROUTER_PROVIDERS,
        provide(LocationStrategy, {useClass: HashLocationStrategy})
    ]).then(() => {
        console.info('done bootstrapping');
    }).catch(err => console.error(err));
});