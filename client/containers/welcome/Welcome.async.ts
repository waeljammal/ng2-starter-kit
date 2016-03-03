import {Component} from 'angular2/core';
import {RandomQuote} from '../../components-composite/random-quote/RandomQuote';

/**
 * An example routable container
 *
 * @author Wael Jammal
 */
@Component({
    selector: 'welcome',
    template: require('./Welcome.html'),
    directives: [RandomQuote]
})
export class Welcome {

}