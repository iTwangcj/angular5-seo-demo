import { Component, Inject, OnInit, PLATFORM_ID, ViewContainerRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr';
import { SpinManager } from './shared/spin/spin-manager';
import { UserService } from './service/user.service';
import { Common } from './utils';

@Component({
    selector: 'app-shell',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

    constructor (meta: Meta,
                 // title: Title,
                 vcr: ViewContainerRef,
                 private router: Router,
                 private spin: SpinManager,
                 private toast: ToastsManager,
                 private userService: UserService,
                 @Inject(PLATFORM_ID) private platformId) {
        if (isPlatformBrowser(this.platformId)) {
            // init toast
            this.toast.setRootViewContainerRef(vcr);
            // seo
            // title.setTitle('My Spiffy Home Page');
            meta.addTags([
                { name: 'author', content: 'femock.com' },
                { name: 'keywords', content: 'angular5 mock, angular seo' },
                { name: 'description', content: 'This is my great description.' }
            ]);
        }
    }

    ngOnInit () {
        if (isPlatformBrowser(this.platformId)) {
            // 旋转服务初始化
            this.spin.init();
            // 初始化用户相关信息
            const user = this.userService.initUser();
            if (!user || Common.isEmptyObject(user)) {
                this.userService.removeUser();
            }
        }
    }
}
