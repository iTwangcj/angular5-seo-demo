import { Directive, HostListener } from '@angular/core';
import { ModalRef } from '../modal.component';

@Directive({ selector: '[m-close]' })
export class ModalDirective {

    constructor (private modalRef: ModalRef) {}

    @HostListener('click', ['$event'])
    onHostClick () {
        if (this.modalRef && this.modalRef.onCancel) {
            this.modalRef.onCancel();
        }
    }
}