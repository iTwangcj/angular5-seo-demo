import { VerificationComponent } from './verification.component';
import { VerificationActivateComponent } from './activate/activate.component';
import { VerificationSignUpComponent } from './signup/signup.component';
import { VerificationEmailModifiedComponent } from './email-modified/email-modified.component';
import { VerificationPasswordResetComponent } from './pwd-reset/pwd-reset.component';

export const routes = [
    {
        path: '',
        component: VerificationComponent,
        children: [
            { path: 'activate/:account', component: VerificationActivateComponent },
            { path: 'register/:account', component: VerificationSignUpComponent },
            { path: 'modified', component: VerificationEmailModifiedComponent },
            { path: 'resetPwd/:account', component: VerificationPasswordResetComponent }
        ]
    }
];