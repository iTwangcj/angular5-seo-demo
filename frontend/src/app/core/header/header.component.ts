import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

    user: any = {};

    private urlApi: any = {
        logout: '/user/logout'  // 登出(注销)
    };

    constructor (private router: Router,
                 @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit (): void {

    }

    /**
     * 登出(注销)
     */
    logout () {

    }
}
