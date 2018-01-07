import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Directive({
    selector: '[debounce]'
})
export class DebounceDirective implements OnInit, OnDestroy {
    @Input() debounceTime = 500;
    @Output() change = new EventEmitter();
    private changes = new Subject<any>();
    private subscription: Subscription;

    constructor () { }

    ngOnInit () {
        this.subscription = this.changes
        .debounceTime(this.debounceTime)
        .subscribe(e => this.change.emit(e));
    }

    ngOnDestroy () {
        this.subscription.unsubscribe();
    }

    @HostListener('keyup', ['$event'])
    changeEvent (event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.changes.next(event);
    }
}