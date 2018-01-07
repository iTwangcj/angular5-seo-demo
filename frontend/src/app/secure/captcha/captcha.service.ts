/* ===================================
 * 验证码服务
 * Created by wangchengjun on 2017/6/7.
 * Copyright 2017 Yooli, Inc.
 * =================================== */
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable()
export class CaptchaService {

    private elmRef: any;

    constructor (@Inject(PLATFORM_ID) private platformId: Object) {

    }

    /**
     * 设置验证码节点
     * @param elmRef
     */
    public setEle (elmRef) {
        this.elmRef = elmRef;
    }

    /**
     * 刷新验证码
     */
    refreshCode () {
        if (this.elmRef && isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem(environment.token) || '';
            this.elmRef.nativeElement.src = `${environment.basePath}/captcha.jpg?token=${token}&${Math.random()}`;
        }
    }

    /**
     * 开启验证倒计时
     * @param verify <{ text: '重新发送', disabled: 'true' }>
     * @param time
     */
    verifyCode (verify, time) {
        const text = verify.text || '重新发送';
        let initialTime = 0, count = time, timer;
        verify = {
            text: text + '(' + count + ')',
            disabled: true
        };

        timer = setInterval(function () {
            count--;
            initialTime = count;
            verify.text = text + '(' + count + ')';
            if (count < 1) {
                count = time;
                verify = {
                    text: text,
                    disabled: false
                };
                clearInterval(timer);
            }
        }, 1000);
    }
}
