import {Component, Output, EventEmitter, HostListener, Input} from 'angular2/core';

/**
 * An example re-usable component
 * 
 * @author Wael Jammal
 */
@Component({
    selector: 'custom-button',
    template: `
        <button type="button">{{label}}</button>
    `
})
export class Button {
    /////////////////////////////////////////////////////////////////
    // INPUTS
    /////////////////////////////////////////////////////////////////

    /**
     * Button label
     */
    @Input()
    public label: string;
    
    /////////////////////////////////////////////////////////////////
    // OUTPUTS
    /////////////////////////////////////////////////////////////////

    /**
     * @event Emitted when the button is clicked
     */
    @Output()
    public onClick: EventEmitter<boolean> = new EventEmitter();
    
    /////////////////////////////////////////////////////////////////
    // HOST LISTENERS
    /////////////////////////////////////////////////////////////////

    /**
     * @private
     */
    @HostListener('click')
    protected onClickEvent() {
        this.onClick.emit(true);
    }
}