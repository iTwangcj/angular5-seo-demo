import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PagesRoutes } from './pages.routes';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';

@NgModule({
    imports: [
        SharedModule.forRoot(),
        RouterModule.forChild(PagesRoutes)
    ],
    declarations: [
        HomeComponent
    ]
})
export class PagesModule {
}
