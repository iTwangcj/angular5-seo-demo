import { AfterContentChecked, Directive, ElementRef, HostListener } from '@angular/core';

const MAX_LOOKUP_RETRIES = 3;

@Directive({
    selector: '[autosize]'
})

export class AutosizeDirective implements AfterContentChecked {
    private retries: number = 0;
    private textAreaEl: any;

    @HostListener('input', ['$event.target'])
    onInput (): void {
        this.adjust();
    }

    constructor (public element: ElementRef) {
        if (this.element.nativeElement.tagName !== 'TEXTAREA') {
            this.findNestedTextArea();

        } else {
            this.textAreaEl = this.element.nativeElement;
        }
    }

    findNestedTextArea () {
        this.textAreaEl = this.element.nativeElement.getElementsByTagName('TEXTAREA')[0];
        if (!this.textAreaEl) {
            if (this.retries >= MAX_LOOKUP_RETRIES) {
                console.warn('autosize: textarea not found');
            } else {
                this.retries++;
                setTimeout(() => {
                    this.findNestedTextArea();
                }, 100);
            }
        }
    }

    ngAfterContentChecked (): void {
        this.adjust();
    }

    adjust (): void {
        if (this.textAreaEl) {
            this.textAreaEl.style.overflow = 'hidden';
            this.textAreaEl.scrollTop = 0;
            this.textAreaEl.style.height = 'auto';
            this.textAreaEl.style.height = this.textAreaEl.scrollHeight + 'px';
        }
    }
}
