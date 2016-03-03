import {Component, Input} from 'angular2/core';

/**
 * An example re-usable component
 *
 * @author Wael Jammal
 */
@Component({
    selector: 'text-area',
    template: `<textarea cols="50" rows="10">{{text}}</textarea>`
})
export class TextArea {
    /////////////////////////////////////////////////////////////////
    // INPUTS
    /////////////////////////////////////////////////////////////////

    /**
     * Text to display
     */
    @Input()
    public text: string;
}