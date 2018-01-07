import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { ErrorMessageService } from './message.service';
import { FormValidateComponent } from './validate.component';
import { FormValidationDirective } from './validation.directive';
import { PATTERNS } from './tokens';
import { PatternService } from './pattern.service';

@NgModule({
    declarations: [
        FormValidationDirective,
        FormValidateComponent
    ],
    imports: [
        CommonModule
    ],
    providers: [
        ErrorMessageService
    ],
    exports: [
        FormValidationDirective,
        FormValidateComponent
    ]
})
export class FormValidationModule {
    static forRoot (): ModuleWithProviders {
        return {
            ngModule: FormValidationModule,
            providers: [
                { provide: PATTERNS, useClass: PatternService }
            ]
        };
    }
}
