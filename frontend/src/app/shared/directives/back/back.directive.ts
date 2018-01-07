import { Directive, HostListener } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
    selector: '[back]'
})
export class BackDirective {

    constructor (private location: Location) {}

    @HostListener('click', ['$event'])
    onHostClick () {
        this.location.back();
    }
}
