import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { ToolsComponent } from './tools.component';
import { ToolsJsonComponent } from './json/json.component';
import { ToolsCssComponent } from './css/css.component';

import { routes } from './tools.routes';

@NgModule({
    imports: [
        SharedModule.forRoot(),
        RouterModule.forChild(routes)
    ],
    declarations: [
        ToolsComponent,
        ToolsJsonComponent,
        ToolsCssComponent
    ]
})
export class ToolsModule {
}