import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../service/http.service';
import { PATTERNS } from '../../../shared/validate/tokens';
import { Message } from '../../../utils';

@Component({
    selector: 'app-verification-password-reset',
    templateUrl: './pwd-reset.component.html'
})
export class VerificationPasswordResetComponent implements OnInit {

    params: any;
    confirm: boolean = false;
    resetStatus: boolean = false;
    newPwdForm: FormGroup;
    msg: string;

    private urlApi: any = {
        sendNewPwd: '/user/sendNewPwd'  // 保存新密码
    };

    constructor (@Inject(PATTERNS) private patterns,
                 private fb: FormBuilder,
                 private httpService: HttpService,
                 private activeRoute: ActivatedRoute) {
    }

    ngOnInit () {
        this.newPwdForm = this.fb.group({
            password: ['', [Validators.required, this.patterns.password]]
        });
        this.activeRoute.params.subscribe(params => {
            this.newPwdForm.valueChanges.subscribe(data => {
                this.params = data;
                this.params.account = params['account'];
            });
        });
    }

    onSubmit () {
        this.httpService.post(this.urlApi.sendNewPwd, this.params).then(result => {
            console.log('sendNewPwd success >> ', result);
            if (result.code === Message.UOK.code) {
                this.confirm = true;
                this.resetStatus = true;
                this.msg = result.msg;
            } else {
                this.httpService.handleResponse(result);
            }
        });
    }
}