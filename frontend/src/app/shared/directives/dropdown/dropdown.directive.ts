import { Directive, HostListener, Output, Input, EventEmitter, Renderer2, ElementRef } from '@angular/core';

@Directive({
	selector: '[dropdown]'
})
export class DropDownDirective {

	private active = false;
	@Output() dropDownStatusChange = new EventEmitter();
	@Input() private activeCss = 'dropdown-active';

	constructor (private elmRef: ElementRef, private renderer: Renderer2) {
	}

	@HostListener('document:click', ['$event'])
	onDocumentClick () {
		this.active = false;
		this.updateHostStatus();
	}

	@HostListener('click', ['$event'])
	onHostClick ($event: any) {
		$event.stopPropagation();
		this.active = !this.active;
		this.updateHostStatus();
	}

	updateHostStatus () {
		this.dropDownStatusChange.emit(this.active);
		if (this.active) {
			this.renderer.addClass(this.elmRef.nativeElement, this.activeCss);
			return;
		}
		this.renderer.removeClass(this.elmRef.nativeElement, this.activeCss);
	}
}
