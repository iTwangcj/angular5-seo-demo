import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DebounceDirective } from './debounce.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [DebounceDirective],
    exports: [DebounceDirective]
})
export class DebounceModule {
}