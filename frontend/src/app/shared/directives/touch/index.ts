import { NgModule } from '@angular/core';
import { TouchDirective } from './touch.directive';

@NgModule({
    declarations: [
        TouchDirective
    ],
    exports: [
        TouchDirective
    ]
})
export class TouchModule {}
