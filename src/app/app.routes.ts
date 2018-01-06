import { Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { BrowserComponent } from './core/browser/browser.component';
import { PrivilegeComponent } from './core/privilege/privilege.component';
import { ErrorComponent } from './core/error/error.component';
import { ForgetPwdComponent } from './secure/forget-pwd/forget-pwd.component';
import { SigninComponent } from './secure/signin/signin.component';
import { SignupComponent } from './secure/signup/signup.component';
import { AuthService } from './service/auth.service';

export const AppRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        loadChildren: './pages/pages.module#PagesModule'
    },
    {
        path: 'login',
        data: { noAllow: true },
        canActivate: [AuthService],
        component: SigninComponent
    },
    {
        path: 'register',
        data: { noAllow: true },
        canActivate: [AuthService],
        component: SignupComponent
    },
    {
        path: 'forget_reset',
        data: { noAllow: true },
        canActivate: [AuthService],
        component: ForgetPwdComponent
    },
    {
        path: 'verification',
        data: { noAllow: true },
        canActivate: [AuthService],
        loadChildren: './secure/verification/verification.module#VerificationModule'
    },
    {
        path: 'browser',
        component: BrowserComponent
    },
    {
        path: 'privilege',
        component: PrivilegeComponent
    },
    {
        path: '**',
        component: ErrorComponent
    }
];
