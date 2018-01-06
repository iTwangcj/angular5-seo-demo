import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
	selector: '[fixed]'
})
export class FixedDirective {

	constructor (private elmRef: ElementRef, private renderer: Renderer2) {
	}

	@HostListener('window:scroll', ['$event'])
	onScroll (event) {
		const scrollY = document.body.scrollTop || document.documentElement.scrollTop;
		if (scrollY > 56) {
			this.renderer.addClass(this.elmRef.nativeElement, 'fixed');
		} else {
			this.renderer.removeClass(this.elmRef.nativeElement, 'fixed');
		}
	}
}