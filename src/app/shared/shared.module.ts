import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({})
export class SharedModule {
    static forRoot () {
        return [
            CommonModule,
            FormsModule,
            ReactiveFormsModule
        ];
    }
}
