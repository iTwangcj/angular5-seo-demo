/* ===================================
 * 验证码指令
 * Created by wangchengjun on 2017/6/5.
 * Copyright 2017 Yooli, Inc.
 * =================================== */
import { Directive, ElementRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CaptchaService } from './captcha.service';
import { environment } from '../../../environments/environment';

@Directive({
    selector: '[captchaImage]'
})
export class CaptchaDirective {

    private token: string;

    constructor (private elmRef: ElementRef,
                 private captchaService: CaptchaService,
                 @Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            this.captchaService.setEle(elmRef);
            this.token = localStorage.getItem(environment.token) || '';
            if (!this.token) {
                this.token = Math.random().toString(36).substr(2);
                localStorage.setItem(environment.token, this.token);
            }
            elmRef.nativeElement.src = `${environment.basePath}/captcha.jpg?token=${this.token}`;
        }
    }

    @HostListener('click')
    onClick () {
        this.elmRef.nativeElement.src = `${environment.basePath}/captcha.jpg?token=${this.token}&${Math.random()}`;
    }
}
