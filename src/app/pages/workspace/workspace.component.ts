import { Component, ElementRef, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr';
import { PATTERNS } from '../../shared/validate/tokens';
import { Common, MockResolve } from '../../utils';
import { ModalService } from '../../shared/modal';
import { EditFolderComponent } from './edit-folder/edit-folder.component';
import { EditInterfaceComponent } from './edit-Interface/edit-Interface.component';
import { RunnerComponent } from './runner/runner.component';
import { HttpService } from '../../service/http.service';

declare const JSONEditor: any;

@Component({
    selector: 'app-workspace',
    templateUrl: './workspace.component.html',
    styleUrls: ['./workspace.component.less']
})
export class WorkspaceComponent implements OnInit {

    formGroup: FormGroup;
    paramsFlag: boolean = false;
    projectId: string = '';
    moduleId: string = '';
    modules: any[] = [];
    musters: any[] = [];
    tabs: any[] = [];
    curTabIndex: number = -1;
    curParamIndex: number = -1;
    typeKeys: any[] = ['key', 'value', 'desc'];
    types: any[] = ['GET', 'POST', 'PUT', 'DELETE'];
    curType: string = this.types[0];
    pNum: string;
    musterId: string;
    editStatus: boolean = false;
    private inputEditor: any = {};
    private outputEditor: any = {};
    private errMsg: string = '';
    private params: any = {};
    private reqParam: any[] = [];
    private headerParam: any[] = [];

    @ViewChild('workspace', { read: ViewContainerRef })
    workspace: ViewContainerRef;

    private urlApi: any = {
        create: '/muster/create',        // 创建新接口
        deleteMuster: '/muster/delete',  // 删除指定接口
        update: '/muster/update',        // 更新指定接口
        musterList: '/muster/list',      // 获取所有接口
        musterInfo: '/muster/detail',    // 获取所有接口

        moduleList: '/module/list',      // 获取所有模块
        deleteModule: '/module/delete',  // 删除指定模块
        updateModule: '/module/update',  // 更新指定模块

        projectDetail: '/project/detail' // 获取指定项目
    };

    private defaultJson: any = {
        'time': '@now()',
        'long': '@integer(10000)',
        'name': '@name',
        'title': '@ctitle',
        'Boolean': true,
        'Null': null,
        '@string("aeiou", 5)': 'key is mock rule',
        'Object': { 'index|1-100': 100, 'name': '@name', 'title': '@ctitle' },
        'Array<Any>': [123, 'string', '@string(7, 10)', { name: '@name' }],
        'Array<Object>|2': [{ 'index|1-100': 100, 'name': '@name', 'title': '@ctitle' }],
        'Array<Boolean>|2': true,
        'Array<Number, random>|1-3': 1,
        'Array<String>|2': '@string(7, 10)',
        'Array<String, rule>|6': ['aaaaa', 'bbbbb', '@string(7, 10)']
    };

    private validatorMap: any = {
        url: [Validators.required, this.patterns.url]
    };

    constructor (private fb: FormBuilder,
                 private ele: ElementRef,
                 private modal: ModalService,
                 private http: HttpService,
                 private activatedRoute: ActivatedRoute,
                 private toast: ToastsManager,
                 @Inject(PATTERNS) private patterns: any) {
        activatedRoute.params.subscribe(params => this.projectId = params.id);
        this.formGroup = this.fb.group({
            url: [''],
            matchParams: [false]
        });
    }

    ngOnInit () {
        this.resizeScreen();
        window.onresize = () => {
            this.resizeScreen();
        };

        const onChange = () => {
            try {
                const content = this.inputEditor.get();
                const jsonObj = MockResolve.parseToJson(content);
                this.outputEditor.set(jsonObj);
                this.errMsg = '';
            } catch (e) {
                // error handle
                if (e.message.includes(':')) {
                    this.errMsg = e.message.split(':')[0];
                }
            }
        };

        const editorContainer = document.getElementById('jsonEditor');
        const editorOptions = {
            // modes: ['text', 'code', 'tree', 'form', 'view'],
            mode: 'code',
            search: true,
            onChange: onChange
        };
        this.inputEditor = new JSONEditor(editorContainer, editorOptions);
        this.inputEditor.set(this.defaultJson);
        // get json
        const viewsContainer = document.getElementById('jsonViews');
        const viewsOptions = {
            modes: ['code', 'view'],
            mode: 'view',
            onEditable: () => { // 视图窗口设置为只读
                return false;
            }
        };
        this.outputEditor = new JSONEditor(viewsContainer, viewsOptions);

        const content = this.inputEditor.get();
        const jsonObj = MockResolve.parseToJson(content);
        this.outputEditor.set(jsonObj);

        this.getModules();
        this.getPNum();
    }

    /**
     * 重置参数
     */
    private resetParams () {
        this.formGroup.reset({ url: '', matchParams: false });
        this.inputEditor.set(this.defaultJson);
        this.outputEditor.set(this.defaultJson);
        const errorMsgDom = this.ele.nativeElement.querySelector('.help-block');
        if (errorMsgDom && errorMsgDom.remove) {
            errorMsgDom.remove();
        }
    }

    /**
     * 开启、关闭指定字段的验证
     */
    editValidator (name: string, status: boolean = false) {
        if (!status) {
            this.formGroup.controls[name].clearValidators();
        } else {
            this.formGroup.controls[name].setValidators(this.validatorMap[name]);
        }
    }

    /**
     * 获取mock接口编号
     */
    getPNum () {
        this.http.get(this.urlApi.projectDetail, { id: this.projectId, fields: 'pNum' }).then(res => {
            if (res && res.data) {
                this.pNum = res.data.pNum;
            }
        });
    }

    /**
     * 展开并解析参数
     */
    onParamsToggle () {
        this.paramsFlag = !this.paramsFlag;
        this.reqParam = [];
        if (this.paramsFlag) {
            this.parseParams();
            if (!this.reqParam.length) {
                this.addParams();
            }
        }
    }

    /**
     * 解析请求参数
     */
    parseParams () {
        this.reqParam = [];
        const url = this.formGroup.value.url;
        if (url && url.includes('?')) {
            const queryString = url.split('?')[1];
            if (queryString.includes('&')) {
                const qsArr = queryString.split('&');
                for (let i = 0, len = qsArr.length; i < len; i++) {
                    const tmpStr = qsArr[i];
                    if (tmpStr && tmpStr.includes('=')) {
                        const tmpArr = tmpStr.split('=');
                        if (tmpArr[0]) {
                            this.reqParam.push({ key: tmpArr[0], value: tmpArr[1] });
                        }
                    }
                }
            } else if (queryString.includes('=')) {
                const tmpArr = queryString.split('=');
                if (tmpArr[0]) {
                    this.reqParam.push({ key: tmpArr[0], value: tmpArr[1] });
                }
            }
        }
    }

    /**
     * 点击添加参数
     */
    addParams () {
        this.reqParam.push({ key: '', value: '' });
    }

    /**
     * 更新url参数
     */
    updateUrl () {
        let url = this.formGroup.value.url;
        if (url && url.includes('?')) {
            url = url.split('?')[0];
        }
        url += '?';
        for (const req of this.reqParam) {
            url += req.key + '=' + req.value + '&';
        }
        url = url.substr(0, url.length - 1);
        this.formGroup.patchValue({ url });
    }

    /**
     * 点击删除参数
     */
    delParams (index: number) {
        this.reqParam.splice(index, 1);
        this.updateUrl();
        if (!this.reqParam.length) {
            this.addParams();
        }
    }

    /**
     * 缓存当前选择请求参数的下标
     */
    setParamIndex (index: number) {
        this.curParamIndex = index;
    }

    /**
     * 缓存当前选择tab标签的下标
     */
    setTabIndex (index: number, musterId: string = '') {
        (async () => {
            if (this.curTabIndex !== index && musterId) {
                await this.getMusterInfo(musterId);
            }
            this.curTabIndex = index;
            this.musterId = musterId;
            if (index === -1) {
                this.resetParams();
                this.editValidator('url', false);
            } else {
                this.editValidator('url', true);
            }
        })();
    }

    /**
     * 设置当前模块id
     */
    interfaceToggle (moduleId: string, isReset: boolean = false) {
        this.moduleId = moduleId;
        // reset musterId、curTabIndex
        if (isReset) {
            this.musterId = '';
            this.curTabIndex = -1;
            this.resetParams();
        }
        // 获取对应模块下的所有接口
        this.getMusters(moduleId);
    }

    /**
     * 设置类型
     */
    setType (type) {
        this.curType = type;
    }

    /**
     * 更新接口id
     */
    updateMusterId (musterId: string, musterName: string) {
        this.musterId = musterId;
        this.editStatus = false;
        this.addTab(musterName);
    }

    /**
     * 更新输入框的值，并且同步至url
     */
    changeInput (type: string, index: number, value: string) {
        const item = this.reqParam[index];
        if (item) {
            if (type === this.typeKeys[0]) { // key
                item.key = value;
            } else if (type === this.typeKeys[1]) { // value
                item.value = value;
            }
        }
        this.updateUrl();
    }

    /**
     * 获取对应项目下所有模块
     */
    getModules () {
        this.http.get(this.urlApi.moduleList, { projectId: this.projectId, fields: 'name' }).then(res => {
            if (res && res.data) {
                this.modules = res.data || [];
            }
        });
    }

    /**
     * 获取对应模块下所有接口
     */
    getMusters (moduleId: string) {
        this.http.get(this.urlApi.musterList, { moduleId }).then(res => {
            if (res && res.data) {
                this.musters = res.data || [];
            }
        });
    }

    /**
     * 刷新接口相关数据
     * @param opts
     */
    updateMusterInfo (opts) {
        this.params.name = opts.name;
        this.params.desc = opts.desc;
        this.params.moduleId = opts.moduleId;
        this.params.moduleName = opts.moduleName;
        this.inputEditor.set(opts.resParam || {});
        this.outputEditor.set(opts.resParam || {});

        // update musters
        this.musters.map(muster => {
            if (muster && opts.musterId && muster._id === opts.musterId) {
                muster.name = opts.name;
                muster.desc = opts.desc;
            }
        });

        // update tabs
        this.tabs.map(tab => {
            if (tab && opts.musterId && tab.musterId === opts.musterId) {
                tab.name = opts.name;
                tab.desc = opts.desc;
            }
        });
    }

    /**
     * 获取接口详情
     */
    getMusterInfo (musterId: string) {
        return this.http.get(this.urlApi.musterInfo, { id: musterId }).then(res => {
            if (res && res.data) {
                // update view
                this.formGroup.patchValue({ url: res.data.url, matchParams: res.data.matchParams });
                this.reqParam = res.data.reqParam;
                this.curType = res.data.type;
                this.updateUrl();
                this.updateMusterInfo(res.data);
            }
            return res;
        });
    }

    /**
     * 重置高度
     */
    resizeScreen () {
        if (!this.workspace.element.nativeElement) return;
        const wHeight = Common.getWinHeight();
        if (wHeight > 700) {
            this.workspace.element.nativeElement.style.height = wHeight - 56 + 'px';
        } else {
            // this.workspace.element.nativeElement.style.height = 500 + 'px';
        }
    }

    /**
     * 添加接口
     */
    addInterface (type: string) {
        this.updateEditStatus(true);
        this.modal.dialog({
            title: '添加接口',
            data: { projectId: this.projectId, type, modules: this.modules },
            template: EditInterfaceComponent,
            confirmCallback: (result: any) => {
                this.modules = [...this.modules, ...result.addModules];
                this.updateMusterInfo(result);
                this.addTab(result.name);
                this.interfaceToggle(result.moduleId);
                this.curTabIndex = this.tabs.length - 1;
            }
        });
    }

    /**
     * 打开新tab
     */
    addTab (musterName: string) {
        let tab: any = null;
        let index: number = null;
        this.tabs.forEach((item, i) => {
            if (item.name === musterName) {
                tab = item;
                index = i;
            }
        });
        if (tab) {
            // 切换至对应的标签页
            if (index >= 0) {
                this.setTabIndex(index, this.musterId);
            }
        } else {
            this.tabs.push({ name: musterName, musterId: this.musterId });
            this.setTabIndex(this.tabs.length - 1, this.musterId);
        }
    }

    /**
     * 删除指定tab
     */
    removeTab (index: number, name: string) {
        this.modal.confirm({
            template: `确定关闭窗口<span style="color: red;">${name}</span>?`,
            confirmCallback: async () => {
                this.tabs.splice(index, 1);
                if (this.tabs.length) {
                    const tab = this.tabs[this.tabs.length - 1];
                    this.musterId = tab.musterId;
                    this.curTabIndex = this.tabs.length - 1;
                    if (tab.musterId) {
                        await this.getMusterInfo(tab.musterId);
                    }
                } else {
                    this.musterId = '';
                    this.curTabIndex = -1;
                    this.resetParams();
                }
            }
        });
    }

    /**
     * 编辑接口
     */
    editInterface (type: string, muster: any) {
        this.modal.dialog({
            title: '编辑接口',
            data: { projectId: this.projectId, type, modules: this.modules, muster },
            template: EditInterfaceComponent,
            confirmCallback: (result) => {
                this.updateMusterInfo(result);
                this.getModules();
            }
        });
    }

    /**
     * 复制接口
     */
    copyInterface () {
        // ..
    }

    /**
     * 删除接口
     */
    delInterface (muster: any) {
        const mRef = this.modal.confirm({ title: '删除接口', template: `确定删除接口<span style="color: red;">${muster.name}</span>?` });
        mRef.confirmCallback(() => {
            this.http.post(this.urlApi.deleteMuster, { musterId: muster._id }, { interceptRes: true }).then(res => {
                if (res) {
                    this.getMusters(this.moduleId);
                    this.toast.success(res.msg);
                }
            });
            return true;
        });
    }

    /**
     * 编辑模块
     */
    editFolder (type: string, module: any) {
        this.modal.dialog({
            title: '编辑模块',
            data: { type, module },
            template: EditFolderComponent,
            confirmCallback: (result) => {
                const modules = this.modules.filter(item => item._id === result.id);
                if (modules.length) {
                    const oldModule = modules[0];
                    oldModule.name = result.name;
                    oldModule.desc = result.desc;
                }
            }
        });
    }

    /**
     * 删除模块
     */
    delFolder (module: any) {
        const mRef = this.modal.confirm({ title: '删除模块', template: `确定删除模块<span style="color: red;">${module.name}</span>?` });
        mRef.confirmCallback(() => {
            this.http.post(this.urlApi.deleteModule, { id: module._id }, { interceptRes: true }).then(res => {
                if (res) {
                    this.toast.success(res.msg);
                    this.getModules();
                }
            });
            return true;
        });
    }

    /**
     * 运行测试
     */
    runner () {
        this.parseParams();
        this.modal.dialog({
            title: false,
            width: 800,
            data: { musterId: this.musterId, pNum: this.pNum },
            template: RunnerComponent
        });
    }

    /**
     * 更新编辑状态
     * @param {boolean} bool
     */
    updateEditStatus (bool: boolean) {
        this.editStatus = bool;
    }

    /**
     * json数据简化及转换为规则
     */
    transform () {
        if (this.errMsg) {
            this.modal.alert({ template: this.errMsg });
            return;
        }
        const content = this.outputEditor.get();
        let jsonRule: any = null;
        try {
            if (typeof content === 'object') {
                jsonRule = MockResolve.parseToRule().rollup(content);
            } else {
                jsonRule = content;
            }
        } finally {
            this.inputEditor.set(jsonRule);
            this.outputEditor.set(MockResolve.parseToJson(jsonRule));
        }
    }

    /**
     * 创建、更新接口数据提交
     */
    submit (isUpdate: boolean = false) {
        if (!this.formGroup.valid) return; // 验证未通过
        if (!this.paramsFlag) this.parseParams();
        this.reqParam = this.reqParam.filter(req => req.key && req.value);
        const params = this.formGroup.value;
        params.name = this.params.name;
        params.desc = this.params.desc;
        params.moduleId = this.params.moduleId;
        params.projectId = this.projectId;
        params.type = this.curType;
        params.reqParam = this.reqParam;
        params.headerParam = this.headerParam;
        params.resParam = this.inputEditor.get();
        if (params.url.includes('?')) {
            params.url = params.url.split('?')[0];
        }
        if (isUpdate) {
            params.id = this.musterId;
            this.http.post(this.urlApi.update, params, { interceptRes: true }).then(res => {
                if (res) {
                    this.updateEditStatus(false);
                    this.musters.map(muster => {
                        if (muster && muster.name === params.name) {
                            muster.type = params.type;
                        }
                    });
                    this.toast.success(res.msg);
                }
            });
        } else {
            this.http.post(this.urlApi.create, params, { interceptRes: true }).then(res => {
                if (res && res.data) {
                    this.musterId = res.data._id;
                    this.getModules();
                    this.getMusters(params.moduleId);
                    this.updateEditStatus(false);
                    this.toast.success(res.msg);
                }
            });
        }
    }
}