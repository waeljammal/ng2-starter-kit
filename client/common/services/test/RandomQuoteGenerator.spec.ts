import {RandomQuoteGenerator} from '../RandomQuoteGenerator';
import {it, describe} from '../../testing/angular2-mocha-testing';

describe('Test Random Quote Generator', () => {
    it('Should return a random quote', () => {
        const service = new RandomQuoteGenerator();
        chai.expect(service.getRandomQuote).to.not.be.empty;
    });
    
    it('Should return a valid quote', () => {
        const service = new RandomQuoteGenerator();
        const quote = service.getRandomQuote();
        chai.expect(service.quotes.indexOf(quote)).to.be.greaterThan(-1);
    });
});