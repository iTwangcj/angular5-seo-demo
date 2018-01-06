import { Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { ErrorComponent } from './core/error/error.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        loadChildren: './pages/pages.module#PagesModule'
    },
    {
        path: '**',
        component: ErrorComponent
    }
];
