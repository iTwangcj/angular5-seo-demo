import { Component, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { ModalService } from '../../shared/modal';
import { EditTeamComponent } from './edit/edit.component';
import { HttpService } from '../../service/http.service';

@Component({
    selector: 'app-teams',
    templateUrl: './teams.component.html',
    styleUrls: ['./teams.component.less']
})
export class TeamsComponent implements OnInit {

    type: string = '';
    teams: any[] = [];

    private urlApi: any = {
        list: '/team/list',
        create: '/team/create',
        deleteTeam: '/team/delete',
        search: '/team/search'
    };

    constructor (private modal: ModalService,
                 private http: HttpService,
                 private toast: ToastsManager) { }

    ngOnInit () {
        this.getTeams();
    }

    /**
     * 所有团队
     */
    getTeams (type: string = '') {
        this.type = type;
        this.http.get(this.urlApi.list, { type }, { interceptRes: true }).then(res => {
            if (res) {
                this.teams = res.data || [];
            }
        });
    }

    /**
     * 创建团队
     */
    addTeam () {
        const result = this.modal.dialog({
            title: '创建团队',
            data: { type: 'add' },
            template: EditTeamComponent
        });
        result.confirmCallback(() => {
            this.getTeams();
            return true;
        });
    }

    /**
     * 更新团队
     */
    editTeam (team: any) {
        this.modal.dialog({
            title: '更新团队',
            data: { type: 'edit', team: team },
            template: EditTeamComponent,
            confirmCallback: (res) => {
                this.toast.success(res.msg);
            }
        });
    }

    /**
     * 删除团队
     */
    delTeam (team: any) {
        const mRef = this.modal.confirm({ title: '删除团队', template: `确定删除团队<span style="color: red;">${team.name}</span>?` });
        mRef.confirmCallback(() => {
            this.http.post(this.urlApi.deleteTeam, { teamId: team._id }, { interceptRes: true }).then(res => {
                if (res) {
                    this.toast.success(res.msg);
                    this.getTeams();
                }
            });
            return true;
        });
    }

    /**
     * 搜索
     */
    findByName (name) {
        if (name) {
            this.http.get(this.urlApi.search, { type: this.type, name }, { interceptRes: true }).then(res => {
                if (res) {
                    this.teams = res.data || [];
                }
            });
        } else {
            this.getTeams();
        }
    }
}