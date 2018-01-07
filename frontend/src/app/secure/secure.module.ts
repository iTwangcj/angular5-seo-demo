import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ForgetPwdComponent } from './forget-pwd/forget-pwd.component';
import { SharedModule } from '../shared/shared.module';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { UserService } from '../service/user.service';
import { CaptchaDirective } from './captcha/captcha.directive';

@NgModule({
    imports: [
        RouterModule,
        SharedModule.forRoot()
    ],
    exports: [],
    providers: [
        UserService
    ],
    declarations: [
        SigninComponent,
        SignupComponent,
        ForgetPwdComponent,
        CaptchaDirective
    ]
})
export class SecureModule {
}