import {Component} from 'angular2/core';
import {TextArea} from '../../components/text-area/TextArea';
import {Button} from '../../components/button/Button';
import {RandomQuoteGenerator} from '../../common/services/RandomQuoteGenerator';

/**
 * An example composite component that can
 * be shared between multiple containers.
 *
 * @author Wael Jammal
 */
@Component({
    selector: 'random-quote',
    template: require('./RandomQuote.html'),
    directives: [TextArea, Button],
    providers: [RandomQuoteGenerator]
})
export class RandomQuote {
    /**
     * Stores the current random quote
     */
    private quote: string;
    
    /** @private */
    constructor(private generator: RandomQuoteGenerator) {
        
    }

    /**
     * Generates a new random quote and stores the value.
     */
    protected newRandomQuote(): void {
        this.quote = this.generator.getRandomQuote();
    }
}