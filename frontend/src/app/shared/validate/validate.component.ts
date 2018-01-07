import { AfterContentChecked, Component, ContentChildren, ElementRef, HostBinding, Input, QueryList } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { ErrorMessage } from './message.models';
import { ErrorMessageService } from './message.service';

@Component({
    selector: '.form-group',
    template: `
        <ng-content></ng-content>
        <div class="help-block" *ngFor="let message of messages">{{message}}</div>
    `
})
export class FormValidateComponent implements AfterContentChecked {

    messages: any[] = [];

    @ContentChildren(FormControlName) FormControlNames: QueryList<FormControlName>;

    @Input() customErrorMessages: ErrorMessage[] = [];

    @Input() validationDisabled: boolean = false;

    private tmpMap = {};

    @HostBinding('class.has-error')
    get hasErrors () {
        const error = this.FormControlNames.some(c => !c.valid && c.dirty && c.touched) && !this.validationDisabled;
        if (error) {
            this.controlHandle((c) => {
                if (c.dirty && c.touched && c.errors) {
                    if (!this.tmpMap[c.name]) {
                        this.tmpMap[c.name] = c.errors;
                        this.getMessages();
                    }
                }
            });
        }
        return error;
    }

    @HostBinding('class.has-success')
    get hasSuccess () {
        const isOk = !this.FormControlNames.some(c => !c.valid) && this.FormControlNames.some(c => c.dirty && c.touched) && !this.validationDisabled;
        if (isOk) {
            this.messages = [];
            this.controlHandle((c) => {
                delete this.tmpMap[c.name];
            });
        }
        return isOk;
    }

    constructor (private elRef: ElementRef, private errorMessageService: ErrorMessageService) {}

    ngAfterContentChecked () {
        this.controlHandle((c) => {
            if (c.dirty && c.touched && c.errors && this.tmpMap[c.name] && JSON.stringify(this.tmpMap[c.name]) !== JSON.stringify(c.errors)) {
                this.tmpMap[c.name] = c.errors;
                this.getMessages();
            }
        });
    }

    private controlHandle (callback) {
        this.FormControlNames.map(c => {
            callback(c);
            return c;
        });
    }

    get label () {
        const label = this.elRef.nativeElement.querySelector('.form-control').getAttribute('placeholder');
        return label ? label.trim() : '';
    }

    get isDirtyAndTouched () {
        return this.FormControlNames.some(c => c.dirty && c.touched);
    }

    get errorMessages (): ErrorMessage[] {
        return this.errorMessageService.mergeArray(this.customErrorMessages, this.errorMessageService.errorMessages);
    }

    getMessages (): string[] {
        this.messages = [];
        if (!this.isDirtyAndTouched || this.validationDisabled) return this.messages;
        this.FormControlNames.filter(c => !c.valid).forEach(control => {
            if (control.errors) {
                Object.keys(control.errors).forEach(key => {
                    const error = this.errorMessages.find(error => error.error === key);
                    if (!error) return;
                    this.messages.push(error.format(this.label, control.errors[key]));
                });
            }
        });
        return this.messages;
    }
}
