import { Directive, Input, HostListener, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
    selector: 'form'
})
export class FormValidationDirective {

    @Input() formGroup: FormGroup;
    @Output() validSubmit = new EventEmitter<any>();

    constructor () {
    }

    @HostListener('submit')
    onSubmit () {
        this.markAsTouchedAndDirty(this.formGroup);
        if (this.formGroup.valid) {
            this.validSubmit.emit(this.formGroup.value);
        }
    }

    markAsTouchedAndDirty (formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(key => {
            if (formGroup.controls[key] instanceof FormGroup) {
                this.markAsTouchedAndDirty(formGroup.controls[key] as FormGroup);
            } else {
                formGroup.controls[key].markAsDirty();
                formGroup.controls[key].markAsTouched();
                formGroup.controls[key].updateValueAndValidity();
            }
        });
    }
}
