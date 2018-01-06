import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaptchaService } from '../captcha/captcha.service';
import { HttpService } from '../../service/http.service';
import { PATTERNS } from '../../shared/validate/tokens';
import { environment } from '../../../environments/environment';
import { UserService } from '../../service/user.service';
import { Common, Message, Crypt } from '../../utils';

declare const particlesJS: any; // 引入描述组件(未定义不能使用)

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    providers: [CaptchaService]
})
export class SigninComponent implements OnInit {

    signInForm: FormGroup;
    params: any = {
        action: false,
        validate: false,
        loginNum: 0
    };

    private urlApi: any = {
        login: '/user/login',       // 登录
        validate: '/user/validate'  // 验证码次数验证
    };

    constructor (@Inject(PATTERNS) private patterns,
                 private router: Router,
                 private fb: FormBuilder,
                 private captchaService: CaptchaService,
                 private userService: UserService,
                 private http: HttpService) {
    }

    ngOnInit (): void {
        this.signInForm = this.fb.group({
            email: ['', [Validators.required, this.patterns.email]],
            password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
            remember: [''],
            validateCode: ['']
        });
        this.initLoginNum();
        particlesJS.load('particles', './assets/particles.json');
    }

    /**
     * 登陆提交
     */
    onSubmit (): void {
        const params = this.signInForm.value;
        params.isPC = Common.platform();

        this.http.post(this.urlApi.login, params).then(result => {
            if (result.code === Message.UOK.code && result.data) {
                localStorage.setItem(environment.expireTime, result.data.expireTime.toString());
                localStorage.setItem(environment.token, result.data.token);
                if (result.data) {
                    localStorage.setItem(environment.session, Crypt.base64Encode(JSON.stringify(result.data)));
                }
                this.userService.setUser(result.data);

                this.onReset();
                this.router.navigateByUrl('teams');
            } else {
                this.params.loginNum += 1;
                localStorage.setItem(environment.loginNum, this.params.loginNum.toString());
                if (this.params.loginNum > 3) {
                    this.params.validate = true;
                    // 刷新验证码
                    this.captchaService.refreshCode();
                }
                this.http.handleResponse(result);
            }
        });
    }

    /**
     * 重置提交相关参数
     */
    onReset () {
        this.params = {
            action: false,
            validate: false,
            loginNum: 0
        };
        localStorage.removeItem(environment.loginNum);
    }

    /**
     * 初始化登陆次数及状态
     */
    initLoginNum () {
        this.params.loginNum = parseInt(localStorage.getItem(environment.loginNum) || '0', 10);
        if (this.params.loginNum > 3) {
            this.params.validate = true;
        }
    }
}
