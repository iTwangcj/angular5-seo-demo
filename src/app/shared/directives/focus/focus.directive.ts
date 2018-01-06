import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[focus]'
})
export class FocusDirective implements AfterViewInit {

    @Input() focus: boolean;
    private element: HTMLElement;
    private hasFocused = false;

    constructor (private $element: ElementRef) {
        this.element = $element.nativeElement;
    }

    ngAfterViewInit () {
        // this.element = this.$element.nativeElement;
        this.giveFocus();
    }

    giveFocus () {
        if (this.focus && !this.hasFocused) {
            this.element.focus();
            this.hasFocused = true;
        }
    }
}
