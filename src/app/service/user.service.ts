import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { Crypt } from '../utils';

@Injectable()
export class UserService {

    isLogin: boolean;
    user: any = {};

    constructor (@Inject(PLATFORM_ID) private platformId: Object) {}

    /**
     * 初始化用户相关信息
     * @returns {any}
     */
    initUser () {
        if (isPlatformBrowser(this.platformId)) {
            const b64Str = localStorage.getItem(environment.session);
            if (b64Str) {
                const expireTime = localStorage.getItem(environment.expireTime);
                if (!expireTime) {
                    this.removeUser();
                } else {
                    const expireTimeNum = Number(expireTime);
                    if (Date.now() > expireTimeNum) {
                        this.removeUser();
                    } else {
                        this.isLogin = true;
                        const userJsonStr = Crypt.base64Decode(b64Str);
                        this.user = JSON.parse(userJsonStr);
                    }
                }
            } else {
                this.removeUser();
            }
        }
        return this.user;
    }

    /**
     * 缓存用户信息
     * @param user
     */
    setUser (user: any): void {
        this.user = user;
        this.isLogin = !!user;
    }

    /**
     * 获取用户信息
     * @returns {any}
     */
    getUser (): any {
        return this.user;
    }

    /**
     * 清除用户所有相关信息
     */
    removeUser (): void {
        this.user = {};
        this.isLogin = false;
        localStorage.removeItem(environment.session);
        localStorage.removeItem(environment.expireTime);
        localStorage.removeItem(environment.token);
    }
}
