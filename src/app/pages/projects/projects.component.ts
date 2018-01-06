import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { ModalService } from '../../shared/modal';
import { EditProjectComponent } from './edit/edit.component';
import { HttpService } from '../../service/http.service';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.less']
})
export class ProjectsComponent implements OnInit {

    // teamId: string;
    type: string = '';
    projects: any[] = [];
    private urlApi: any = {
        list: '/project/list',      // 获取所有项目
        create: '/project/create',  // 创建新项目
        remove: '/project/delete',  // 删除指定项目
        query: '/project/query'     // 模糊匹配项目
    };

    constructor (private modal: ModalService,
                 private http: HttpService,
                 private activatedRoute: ActivatedRoute,
                 private toast: ToastsManager) {
        this.activatedRoute.params.subscribe(params => {
            // this.teamId = params.teamId;
        });
    }

    ngOnInit () {
        this.getProjects();
    }

    /**
     * 根据类型获取项目
     * @param {string} type
     */
    getProjects (type: string = '') {
        this.type = type;
        this.http.get(this.urlApi.list, { type /*teamId: this.teamId*/ }).then(res => {
            if (res) {
                this.projects = res.data || [];
            }
        });
    }

    /**
     * 创建项目
     */
    addPro () {
        this.modal.dialog({
            title: '创建项目',
            data: { type: 'add' },
            template: EditProjectComponent,
            confirmCallback: () => {
                this.getProjects();
            }
        });
    }

    /**
     * 更新项目
     */
    editPro (project: any) {
        this.modal.dialog({
            title: '更新项目',
            data: { type: 'edit', project: project },
            template: EditProjectComponent,
            confirmCallback: (res) => {
                this.toast.success(res.msg);
            }
        });
    }

    /**
     * 删除项目
     */
    delPro (project: any) {
        const mRef = this.modal.confirm({ title: '删除项目', template: `确定删除项目<span style="color: red;">${project.name}</span>?` });
        mRef.confirmCallback(() => {
            this.http.post(this.urlApi.remove, { projectId: project._id }, { interceptRes: true }).then(res => {
                if (res) {
                    this.toast.success(res.msg);
                    this.getProjects();
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
            this.http.get(this.urlApi.query, { type: this.type, name }, { interceptRes: true }).then(res => {
                if (res) {
                    this.projects = res.data || [];
                }
            });
        } else {
            this.getProjects();
        }
    }
}