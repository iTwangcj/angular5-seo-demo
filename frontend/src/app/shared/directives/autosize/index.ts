
import { NgModule } from '@angular/core';
import { AutosizeDirective } from './autosize.directive';

export * from './autosize.directive';

@NgModule({
    declarations: [
        AutosizeDirective
    ],
    exports: [
        AutosizeDirective
    ]
})
export class AutosizeModule {}

