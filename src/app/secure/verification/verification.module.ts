import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './verification.routes';
import { VerificationComponent } from './verification.component';
import { VerificationActivateComponent } from './activate/activate.component';
import { VerificationSignUpComponent } from './signup/signup.component';
import { VerificationEmailModifiedComponent } from './email-modified/email-modified.component';
import { VerificationPasswordResetComponent } from './pwd-reset/pwd-reset.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule.forRoot(),
        RouterModule.forChild(routes)
    ],
    declarations: [
        VerificationComponent,
        VerificationActivateComponent,
        VerificationSignUpComponent,
        VerificationEmailModifiedComponent,
        VerificationPasswordResetComponent
    ]
})
export class VerificationModule {
}