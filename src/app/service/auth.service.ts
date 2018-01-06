import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class AuthService implements CanActivate {

    constructor (private router: Router, private userService: UserService) {}

    canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (route.data && route.data.noAllow) { // 不允许登陆后再进入的路由
            if (this.userService.isLogin) {
                this.router.navigateByUrl('teams').catch();
                return false;
            }
            return true;
        } else {
            if (this.userService.isLogin) {
                return true;
            }
            this.router.navigateByUrl('login').catch();
            return false;
        }
    }
}
