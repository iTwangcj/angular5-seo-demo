import { NgModule } from '@angular/core';
import { FixedDirective } from './fixed.directive';

@NgModule({
    declarations: [
        FixedDirective
    ],
    exports: [
        FixedDirective
    ]
})
export class FixedModule {}
