import { Component, OnInit } from '@angular/core';
import { ModalRef } from '../../../shared/modal';
import { UserService } from '../../../service/user.service';
import { HttpService } from '../../../service/http.service';

declare const JSONEditor: any;

@Component({
    selector: 'app-runner',
    templateUrl: './runner.component.html',
    styleUrls: ['./runner.component.less']
})
export class RunnerComponent implements OnInit {

    params: any;
    tabIndex: any = 1;
    reqParam: any[] = [];
    resParam: any = {};
    headerJsonStr: string;
    serverName: string;
    status: number;
    url: string;
    type: string;
    reqJsonStr: string;

    constructor (private modalRef: ModalRef, private userService: UserService, private http: HttpService) {}

    ngOnInit () {
        this.params = this.modalRef.data;
        const user: any = this.userService.getUser();
        if (user && user.serverName) {
            this.serverName = user.serverName;
        }
        this.http.get('/muster/detail', { id: this.params.musterId || '', fields: 'resParam, url, type, reqParam' }, { interceptRes: true, response: true }).then(res => {
            if (res) {
                this.status = res.status;
                this.resParam = res.body.data.resParam;
                this.url = res.body.data.url;
                this.type = res.body.data.type;
                this.reqParam = res.body.data.reqParam.filter(req => req.key && req.value);

                const viewsContainer = document.getElementById('runnerViews');
                const viewsOptions = { mode: 'code', height: 300 };
                const viewsEditor = new JSONEditor(viewsContainer, viewsOptions);
                if (this.resParam) {
                    viewsEditor.set(this.resParam);
                }

                if (this.reqParam.length) {
                    const tmpObj: any = {};
                    for (const req of this.reqParam) {
                        tmpObj[req.key] = req.value;
                    }
                    this.reqJsonStr = JSON.stringify(tmpObj, null, 4);
                }

                const headerObj: any = {};
                if (res.headers) {
                    const keys = res.headers.keys();
                    for (const key of keys) {
                        headerObj[key] = res.headers.get(key);
                    }
                }
                this.headerJsonStr = JSON.stringify(headerObj, null, 4);
            }
        });
    }

    onSwitch (index) {
        this.tabIndex = index;
    }
}
