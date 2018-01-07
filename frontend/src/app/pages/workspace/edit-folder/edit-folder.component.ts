import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr';
import { HttpService } from '../../../service/http.service';
import { ModalRef } from '../../../shared/modal';
import { PATTERNS } from '../../../shared/validate/tokens';

@Component({
    selector: 'app-edit-folder',
    templateUrl: './edit-folder.component.html'
})
export class EditFolderComponent implements OnInit {

    params: any = {};
    formGroup: FormGroup;

    private urlApi = {
        update: '/module/update'  // 更新模块
    };

    constructor (private fb: FormBuilder,
                 private modalRef: ModalRef,
                 @Inject(PATTERNS) private patterns: any,
                 private http: HttpService,
                 private toast: ToastsManager) {
    }

    ngOnInit () {
        this.params = this.modalRef.data;
        this.formGroup = this.fb.group({
            name: [this.params && this.params.module ? this.params.module.name : '', [Validators.required, this.patterns.name]],
            desc: [this.params && this.params.module ? this.params.module.desc : '']
        });
    }

    submit () {
        if (!this.formGroup.valid) return; // 验证未通过
        const params: any = this.formGroup.value;
        params.id = this.params.module._id;
        params.projectId = this.params.module.projectId;
        this.http.post(this.urlApi.update, params, { interceptRes: true }).then(res => {
            if (res) {
                this.modalRef.onConfirm(params);
                this.toast.success(res.msg);
            }
        });
    }
}