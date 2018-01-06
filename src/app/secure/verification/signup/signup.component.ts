import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { CaptchaService } from '../../captcha/captcha.service';
import { HttpService } from '../../../service/http.service';
import { Message } from '../../../utils';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    providers: [CaptchaService]
})
export class VerificationSignUpComponent implements OnInit {

    verify: any = {
        text: '重发激活邮件',
        disabled: false
    };

    params: any;

    private urlApi: any = {
        sendActivateMail: '/user/resendActivateMail'    // 重新发送激活邮件
    };

    constructor (private activeRoute: ActivatedRoute,
                 private httpService: HttpService,
                 private toast: ToastsManager,
                 private captchaService: CaptchaService) { }

    ngOnInit () {
        this.activeRoute.params.subscribe(params => this.params = params);
    }

    resendActivateMail () {
        this.httpService.post(this.urlApi.sendActivateMail, { account: this.params.account || '' }).then(result => {
            if (result.code === Message.UOK.code) {
                this.captchaService.verifyCode(this.verify, 60);
                this.toast.success(result.msg);
            } else {
                this.httpService.handleResponse(result);
            }
        });
    }
}