import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr';
import { ModalRef, ModalService } from '../../../shared/modal';
import { PATTERNS } from '../../../shared/validate/tokens';
import { HttpService } from '../../../service/http.service';

export class DataType {
    projectId: string;
    type: string;
    modules: any[];
    muster?: any;
}

@Component({
    selector: 'app-edit-interface',
    templateUrl: './edit-interface.component.html'
})
export class EditInterfaceComponent implements OnInit {

    formGroup: FormGroup;
    params: DataType;
    folderOpen = false;
    tmpModules: any[] = [];
    addModules: any[] = [];
    moduleId: string;

    private urlApi = {
        createModule: '/module/create',  // 创建新模块
        updateMuster: '/muster/update'   // 更新接口
    };

    constructor (private fb: FormBuilder,
                 private modalRef: ModalRef,
                 @Inject(PATTERNS) private patterns: any,
                 private http: HttpService,
                 private modal: ModalService,
                 private toast: ToastsManager) {
    }

    ngOnInit () {
        this.params = this.modalRef.data;
        this.tmpModules = [...this.params.modules];
        let module: any = null;
        if (this.params && this.params.muster) {
            this.moduleId = this.params.muster.moduleId;
            module = this.getModule(null, this.params.muster.moduleId);
        }
        this.formGroup = this.fb.group({
            name: [this.params && this.params.muster ? this.params.muster.name : '', [Validators.required, this.patterns.name]],
            desc: [this.params && this.params.muster ? this.params.muster.desc : ''],
            moduleName: [module ? module.name : '', Validators.required]
        });
    }

    getModule (moduleName: string | null, moduleId?: string) {
        let modules: any[];
        if (moduleId) {
            modules = this.tmpModules.filter(module => module._id === moduleId);
        } else {
            modules = this.tmpModules.filter(module => module.name === moduleName);
        }
        return modules.length ? modules[0] : null;
    }

    /**
     * 显示添加模块输入框
     */
    showAddFolder () {
        this.folderOpen = true;
        this.tmpModules = [...this.params.modules];
    }

    /**
     * 添加模块至缓存,且同步至搜索输入框
     */
    addFolder (name: string, id: string, isCreate) {
        this.folderOpen = false;
        this.moduleId = id;
        this.formGroup.patchValue({ moduleName: name });
        if (isCreate) {
            this.tmpModules.unshift({ name: name });
            this.addModules.push({ name: name });
        }
    }

    /**
     * 搜素成员
     */
    searchMember (keyWord) {
        if (keyWord) {
            // 模糊匹配
            this.tmpModules = [];
            for (const module of this.params.modules) {
                if (module && module.name.includes(keyWord)) {
                    this.tmpModules.push(module);
                }
            }
        } else {
            this.tmpModules = [...this.params.modules];
        }
    }

    /**
     * 提交
     */
    submit () {
        if (!this.formGroup.valid) return; // 验证未通过
        const module = this.getModule(this.formGroup.value.moduleName);
        if (!module) {
            this.modal.alert({ template: '请选择或创建模块' });
            return;
        }
        const formValue = this.formGroup.value;
        const getResult = (musterId: string = '') => {
            const result = formValue;
            result.moduleId = this.moduleId;
            result.musterId = musterId;
            result.addModules = this.addModules || [];
            result.addModules.map(module => {
                if (module && module.name === result.name) {
                    module._id = this.moduleId;
                }
            });
            return result;
        };
        if (this.addModules.length) {
            const params: any = {};
            params.modules = this.addModules;
            params.projectId = this.params.projectId;
            params.moduleName = formValue.moduleName;
            this.http.post(this.urlApi.createModule, params, { interceptRes: true }).then(res => {
                if (res) {
                    // 确认回调
                    if (res.data) this.moduleId = res.data._id;
                    this.modalRef.onConfirm(getResult());
                    if (this.params.type === 'edit') {
                        this.toast.success(res.msg);
                    }
                }
            });
        } else {
            const module = this.getModule(formValue.moduleName);
            if (module) this.moduleId = module._id;
            if (this.params.type === 'edit') {
                const params: any = {};
                params.url = this.params.muster.url;
                params.name = formValue.name || '';
                params.desc = formValue.desc;
                params.id = this.params.muster._id;
                params.moduleId = this.moduleId;
                params.projectId = this.params.projectId;
                params.type = this.params.muster.type;
                params.reqParam = this.params.muster.reqParam;
                params.headerParam = this.params.muster.headerParam;
                params.resParam = this.params.muster.resParam;
                this.http.post(this.urlApi.updateMuster, params, { interceptRes: true }).then(res => {
                    if (res) {
                        // 确认回调
                        this.modalRef.onConfirm(getResult(this.params.muster._id));
                        this.toast.success(res.msg);
                    }
                });
            } else {
                // type: add
                this.modalRef.onConfirm(getResult());
            }
        }
    }
}