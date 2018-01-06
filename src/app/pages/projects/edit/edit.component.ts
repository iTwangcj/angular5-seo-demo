import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ModalRef, ModalService } from '../../../shared/modal';
import { HttpService } from '../../../service/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PATTERNS } from '../../../shared/validate/tokens';

@Component({
    selector: 'app-project-edit',
    templateUrl: './edit.component.html'
})
export class EditProjectComponent implements OnInit {

    params: { type: string, project?: any };
    members: any[] = [];
    tmpMembers: any[] = [];
    formGroup: FormGroup;
    teams: any[] = [];
    tmpTeam: any = {};

    private urlApi = {
        create: '/project/create',  // 创建新项目
        remove: '/project/delete',  // 删除指定项目
        update: '/project/update',  // 更新项目
        search: '/user/search',     // 模糊匹配用户
        teamList: '/team/list'      // 获取所有团队
    };

    constructor (private fb: FormBuilder,
                 private modalRef: ModalRef,
                 @Inject(PATTERNS) private patterns: any,
                 private http: HttpService,
                 private modal: ModalService,
                 private render: Renderer2) {
    }

    ngOnInit () {
        this.params = this.modalRef.data;
        this.formGroup = this.fb.group({
            name: [this.params && this.params.project ? this.params.project.name : '', [Validators.required, this.patterns.name]],
            team: [this.params && this.params.project ? this.params.project.teamName : '', [Validators.required]],
            desc: [this.params && this.params.project ? this.params.project.desc : '']
        });
        if (this.params && this.params.project) {
            this.tmpMembers = [...this.params.project.members]; // 不要操作源对象,会影响到本源数据!!!
            this.tmpTeam = {
                _id: this.params.project.teamId,
                name: this.params.project.teamName
            };
        }
        this.getTeams();
    }

    /**
     * 获取所有团队
     */
    getTeams () {
        this.http.get(this.urlApi.teamList, { fields: 'name' }).then(res => {
            if (res) {
                this.teams = res.data || [];
            }
        });
    }

    /**
     * 搜素成员
     */
    searchMember (name) {
        if (name) {
            this.http.get(this.urlApi.search, { name, fields: 'name' }, { interceptRes: true }).then(res => {
                if (res) {
                    this.members = res.data;
                }
            });
        } else {
            this.members = [];
        }
    }

    /**
     * 临时保存项目信息
     */
    addTeam (selectDom: any, inputDom: any, team: any) {
        this.tmpTeam = team;
        this.render.setProperty(inputDom, 'value', team.name);
        this.formGroup.patchValue({ team: team.name });
        this.render.setStyle(selectDom, 'display', 'none');
    }

    /**
     * 选择项目
     */
    selectTeam (ele: any, isClose: boolean = false) {
        if (ele) {
            let timer: any = null;
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.render.setStyle(ele, 'display', isClose ? 'none' : 'block');
                clearTimeout(timer);
            }, isClose ? 200 : 0);
        }
    }

    /**
     * 添加成员(本地缓存,提交后统一服务器添加)
     */
    addMember (membersDom, search, member) {
        const tmpMemberNum = this.tmpMembers.filter(item => item.memberId === member._id).length;
        if (tmpMemberNum) {
            this.modal.alert({ template: `成员 ${member.name} 已存在!` });
            return;
        }
        this.members = [];
        this.tmpMembers.push({ memberId: member._id, memberName: member.name });
        this.render.setStyle(membersDom, 'display', 'none');
        this.render.setProperty(search, 'value', '');
    }

    /**
     * 删除成员(本地缓存,提交后统一服务器删除)
     */
    delMember (id) {
        for (let i = 0, len = this.tmpMembers.length; i < len; i++) {
            const member = this.tmpMembers[i];
            if (member && member.memberId === id) {
                this.tmpMembers.splice(i, 1);
            }
        }
    }

    /**
     * 提交
     */
    submit () {
        if (!this.formGroup.valid) return; // 验证未通过
        const params = this.formGroup.value;
        params.members = this.tmpMembers;
        params.teamId = this.tmpTeam._id;
        params.teamName = this.tmpTeam.name;
        let url = this.urlApi.create;
        if (this.params.type === 'edit') {
            url = this.urlApi.update;
            params.projectId = this.params.project._id;
        }
        this.http.post(url, params, { interceptRes: true }).then(res => {
            if (res) {
                this.modalRef.onConfirm(res);
                this.updateSource();
            }
        });
    }

    /**
     * 更新源数据,避免二次打开页面数据还是旧的
     */
    private updateSource () {
        if (this.params.type === 'edit') {
            this.params.project.members = this.tmpMembers;
            this.params.project.teamId = this.tmpTeam._id;
            this.params.project.teamName = this.tmpTeam.name;
        }
    }
}