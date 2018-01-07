import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from '../../utils';
import { HttpService } from '../../service/http.service';
import { PATTERNS } from '../../shared/validate/tokens';

@Component({
    selector: 'app-forget-pwd',
    templateUrl: './forget-pwd.component.html'
})
export class ForgetPwdComponent implements OnInit {

    params: any;
    sendEmail: boolean = false;
    retPwdForm: FormGroup;

    private urlApi: any = {
        resetPwd: '/user/resetPwd'  // 重置密码
    };

    constructor (@Inject(PATTERNS) private patterns,
                 private fb: FormBuilder,
                 private httpService: HttpService) {
    }

    ngOnInit () {
        this.retPwdForm = this.fb.group({
            email: ['', [Validators.required, this.patterns.email]]
        });
        this.retPwdForm.valueChanges.subscribe(data => this.params = data);
    }

    /**
     * 重置密码提交
     */
    onSubmit () {
        this.params.origin = window.location.origin;
        this.httpService.post(this.urlApi.resetPwd, this.params).then(result => {
            console.log('resetPwd success >> ', result);
            if (result.code === Message.UOK.code) {
                this.sendEmail = true;
            } else {
                this.httpService.handleResponse(result);
            }
        });
    }
}