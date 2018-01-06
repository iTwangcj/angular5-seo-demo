import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'angular-highcharts';
import { ModalModule } from './modal';
import { FormValidationModule } from './validate';
import { PaginationModule } from './pagination';
import { TooltipModule } from './tooltip';
import { SpinModule } from './spin';
import { TouchModule } from './directives/touch';
import { DropdownModule } from './directives/dropdown';
import { BackModule } from './directives/back';
import { AutosizeModule } from './directives/autosize';
import { FocusModule } from './directives/focus';
import { FixedModule } from './directives/fixed';
import { DatePipeModule } from './pipes/date';
import { DebounceModule } from './directives/debounce';

@NgModule({})
export class SharedModule {
    static forRoot () {
        return [
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            FormValidationModule.forRoot(),
            ChartModule,
            ModalModule.forRoot(),
            TooltipModule.forRoot(),
            SpinModule.forRoot(),
            PaginationModule,
            TouchModule,
            DropdownModule,
            BackModule,
            AutosizeModule,
            FocusModule,
            FixedModule,
            DatePipeModule,
            DebounceModule
        ];
    }
}