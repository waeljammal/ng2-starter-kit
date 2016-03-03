import {Component} from 'angular2/core';
import {AsyncRoute, RouteConfig, RouterOutlet} from 'angular2/router';

/**
 * Main entry point for the application
 *
 * @author Wael Jammal
 */
@Component({
    selector: 'app',
    template: require('./App.html'),
    directives: [RouterOutlet]
})
@RouteConfig([
    new AsyncRoute({
        path: '/welcome',
        loader: () => require('../welcome/Welcome.async')('Welcome'),
        name: 'Welcome',
        useAsDefault: true
    })
])
export class App {
    
}