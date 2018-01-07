import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalRef, ModalService } from '../../../shared/modal';
import { PATTERNS } from '../../../shared/validate/tokens';
import { HttpService } from '../../../service/http.service';

@Component({
    selector: 'app-project-edit',
    templateUrl: './edit.component.html'
})
export class EditTeamComponent implements OnInit {

    params: { type: string, team?: any };
    members: any[] = [];
    tmpMembers: any[] = [];
    formGroup: FormGroup;

    private urlApi = {
        create: '/team/create',
        update: '/team/update',
        search: '/user/search'
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
            name: [this.params && this.params.team ? this.params.team.name : '', [Validators.required, this.patterns.name]],
            desc: [this.params && this.params.team ? this.params.team.desc : '']
        });
        if (this.params && this.params.team) {
            this.tmpMembers = [...this.params.team.members]; // 不要操作源对象,会影响到本源数据!!!
        }
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
        let url = this.urlApi.create;
        if (this.params.type === 'edit') {
            url = this.urlApi.update;
            params.teamId = this.params.team._id;
        }
        this.http.post(url, params, { interceptRes: true }).then(res => {
            if (res) {
                this.modalRef.onConfirm(res);
                if (this.params.type === 'edit') {
                    this.params.team.members = this.tmpMembers;
                }
            }
        });
    }
}