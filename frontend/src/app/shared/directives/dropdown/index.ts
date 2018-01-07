import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DropDownDirective } from './dropdown.directive';

@NgModule({
	imports: [CommonModule],
	declarations: [DropDownDirective],
	exports: [DropDownDirective]
})
export class DropdownModule {}