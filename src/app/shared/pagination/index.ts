import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaginationConfig } from './pagination.config';
import { PaginationComponent } from './pagination.component';

@NgModule({
    imports: [CommonModule],
    declarations: [PaginationComponent],
    exports: [PaginationComponent],
    providers: [PaginationConfig]
})
export class PaginationModule {
}
