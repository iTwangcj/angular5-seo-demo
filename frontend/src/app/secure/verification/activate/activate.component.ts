import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../service/http.service';
import { Message } from '../../../utils';

@Component({
    selector: 'app-verification-activate',
    templateUrl: './activate.component.html'
})
export class VerificationActivateComponent implements OnInit {

    confirm: boolean = true;
    msg: string;

    private urlApi: any = {
        register: '/user/register'  // 注册
    };

    constructor (private httpService: HttpService,
                 private activeRoute: ActivatedRoute) { }

    ngOnInit () {
        this.activeRoute.params.subscribe(params => {
            this.activate(params);
        });
    }

    activate (params) {
        this.httpService.get(this.urlApi.register, { account: params.account }).then(result => {
            this.msg = result.msg;
            if (result.code === Message.UOK.code) {
                this.confirm = false;
            } else {
                this.httpService.handleResponse(result);
            }
        });
    }
}