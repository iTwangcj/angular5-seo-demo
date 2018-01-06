import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { Message } from '../../utils';
import { PATTERNS } from '../../shared/validate/tokens';
import { CaptchaService } from '../captcha/captcha.service';

declare const particlesJS: any; // 引入描述组件(未定义不能使用)

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    providers: [CaptchaService]
})
export class SignupComponent implements OnInit {

    signUpForm: FormGroup;

    private urlApi: any = {
        validate: '/user/validate'  // 验证码次数验证
    };

    constructor (@Inject(PATTERNS) private patterns,
                 private router: Router,
                 private fb: FormBuilder,
                 private http: HttpService,
                 private captchaService: CaptchaService) {
    }

    ngOnInit () {
        const password = this.fb.control('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
        this.signUpForm = this.fb.group({
            email: ['', [Validators.required, this.patterns.email]],
            password: password,
            repasswd: this.fb.control('', [Validators.required, this.patterns.equalTo(password)]),
            validateCode: ['']
        });
        particlesJS.load('particles', './assets/particles.json');
    }

    onSubmit () {
        const params = this.signUpForm.value;
        params.origin = window.location.origin;
        this.http.post(this.urlApi.validate, params).then(result => {
            console.log('signUp success >> ', result);
            if (result.code === Message.UOK.code) {
                this.router.navigate(['/verification/register/', result.data.account]);
            } else {
                // 刷新验证码
                this.captchaService.refreshCode();
                this.http.handleResponse(result);
            }
        });
    }
}