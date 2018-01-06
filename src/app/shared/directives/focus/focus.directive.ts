import { AfterViewInit, Directive, ElementRef, Inject, Input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
    selector: '[focus]'
})
export class FocusDirective implements AfterViewInit {

    @Input() focus: boolean;
    private element: HTMLElement;
    private hasFocused = false;

    constructor (private $element: ElementRef, @Inject(PLATFORM_ID) private platformId: Object) {
        this.element = $element.nativeElement;
    }

    ngAfterViewInit () {
        if (isPlatformBrowser(this.platformId)) {
            // this.element = this.$element.nativeElement;
            this.giveFocus();
        }
    }

    giveFocus () {
        if (this.focus && !this.hasFocused) {
            this.element.focus();
            this.hasFocused = true;
        }
    }
}
