import {Injectable} from 'angular2/core';

/**
 * Extracts and returns a random quote.
 * 
 * @author Wael Jammal
 */
@Injectable()
export class RandomQuoteGenerator {
    private _quotes: Array<string>;

    /**
     * @returns {Array<string>} List of quotes
     */
    public get quotes(): Array<string> {
        return this._quotes;
    }

    /**
     * Loads quotes
     */
    constructor() {
        const data: any = require('raw!../fixtures/quotes.json');
        this._quotes = JSON.parse(data).quotes;
    }

    /**
     * Returns a random quote.
     * 
     * @returns {string} The quote.
     */
    public getRandomQuote(): string {
        const count = this.quotes.length - 1;
        const random = Math.floor(Math.random() * count) + 1;
        
        return this.quotes[random];
    }
}