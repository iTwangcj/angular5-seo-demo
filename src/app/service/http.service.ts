/* =================================
 * http服务
 * 对http请求做统一处理
 * Created by wangcj on 2017/08/07.
 * Copyright 2017 Yooli, Inc
 * ================================= */
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ToastsManager } from 'ng2-toastr';

import { environment } from '../../environments/environment';
// import { Crypt } from '../utils';
import { Message } from '../utils';
import { ModalRef, ModalService } from '../shared/modal';

export interface Options {
    interceptRes?: boolean; // 是否开启统一错误处理
    response?: any;         // 是否开启返回头信息
}

@Injectable()
export class HttpService {

    constructor (private router: Router,
                 private http: HttpClient,
                 private toast: ToastsManager,
                 private modal: ModalService,
                 private modalRef: ModalRef,
                 @Inject(PLATFORM_ID) private platformId: Object) {
    }

    /**
     * 格式化url
     */
    private formatUrl (url: string): string {
        let baseUrl = '';
        url = url.replace(/\/\//g, '/');
        if (environment.basePath) {
            baseUrl = environment.basePath;
            const lastStr = baseUrl.substr(-1);
            if (lastStr === '/') {
                baseUrl = baseUrl.substring(0, baseUrl.length - 1);
            }
        }
        if (url && url.substr(0, 1) !== '/') {
            baseUrl += '/';
        }
        baseUrl += url;
        return baseUrl;
    }

    /**
     * 获取token
     * @returns {string}
     */
    private get token () {
        let token = '';
        if (isPlatformBrowser(this.platformId)) {
            token = localStorage.getItem(environment.token);
            if (!token) {
                token = Math.random().toString(36).substr(2);
                localStorage.setItem(environment.token, token);
            }
        }
        return token;
    }

    /**
     * 获取头信息
     *  由于HttpHeaders对象是不可变的，所以属性只能在第一次set,多个值时，用链式写入.
     *  eg:
     *  new HttpHeaders().set('token', getToken()).set('X-CustomHeader', 'CustomHeaderValue').set(...)
     *  or
     *  new HttpHeaders({...})
     */
    private getHeaders (options?: any): HttpHeaders {
        const defaultHeaders: any = { token: this.token };
        if (options && options.headers && typeof options.headers === 'object') {
            const headers = options.headers;
            for (const key in headers) {
                if (key && headers.hasOwnProperty(key)) {
                    defaultHeaders[key] = headers[key];
                }
            }
        }
        return new HttpHeaders(defaultHeaders);
    }

    /**
     * get请求
     * @param url 接口地址
     * @param params 参数 [可选]
     * @param options 参数 [可选]
     * @returns {Promise<Object>}
     */
    public get (url: string, params: any = {}, options?: Options): Promise<any> {
        return this.request('get', url, params, options);
    }

    /**
     * post请求
     * @param url 接口地址
     * @param params 参数
     * @param options 参数 [可选]
     * @returns {Promise<Object>}
     */
    public post (url: string, params: any = {}, options?: Options): Promise<any> {
        return this.request('post', url, params, options);
    }

    /**
     * delete请求
     * @param url 接口地址
     * @param params 参数 [可选]
     * @param options 参数 [可选]
     * @returns {Promise<Object>}
     */
    public delete (url: string, params: any = {}, options?: Options): Promise<any> {
        return this.request('delete', url, params, options);
    }

    /**
     * put请求
     * @param url 接口地址
     * @param params 参数 [可选]
     * @param options 参数 [可选]
     * @returns {Promise<Object>}
     */
    public put (url: string, params: any = {}, options?: Options): Promise<any> {
        return this.request('put', url, params, options);
    }

    /**
     * request请求处理
     * @param {string} method
     * @param {string} url
     * @param params
     * @param {Options} options
     * @returns {Promise<any>}
     */
    private request (method: string, url: string, params: any = {}, options?: Options) {
        const defaultOptions: any = {
            headers: this.getHeaders(options),
            observe: options && options.response ? 'response' : 'body'
        };
        let args = [this.formatUrl(url), params, defaultOptions];
        if (method === 'delete' || method === 'get') {
            args = [this.formatUrl(url), defaultOptions];
            defaultOptions.params = new HttpParams({ fromObject: params });
        }
        return new Promise((resolve) => {
            this.http[method](...args)
            .subscribe(res => {
                if (options && options.interceptRes) {
                    if (this.interceptResponse(res, options)) return resolve(res);
                    return resolve(null);
                }
                return resolve(res);
            }, error => this.handleError(error));
        });
    }

    /**
     * 处理请求结果
     * @param result
     */
    public handleResponse (result: any): void {
        let msg = '';
        if (!result) {
            msg = ('网络繁忙,未返回数据');
        } else {
            if (result.msg) {
                msg = result.msg;
            } else {
                if (!result.code) {
                    msg = ('网络繁忙,未返回CODE');
                } else {
                    msg = ('网络繁忙,未返回MSG');
                }
            }
        }
        if (result.code === Message.UserNotLogin.code) {
            this.noLoginIntercept(Date.now());
        } else if (result.code === Message.notAllow.code) {
            this.router.navigateByUrl('permission');
        } else {
            this.toast.error(msg);
        }
    }

    /**
     * 未登录拦截
     */
    private noLoginIntercept (expireTime: number) {
        if (expireTime >= 0 && isPlatformBrowser(this.platformId)) {
            // const user = this.shared.user;
            // localStorage.removeItem(environment.session);
            // this.shared.removeUser();
            // // remove modal
            // this.modalRef.remove();
            // if (user && !Crypt.isEmptyObject(user)) {
            //     this.get(this.apiService.userApi.delScience, { userId: user.userId }).then(() => {
            //         this.modal.confirm({
            //             template: '您还没登录或者登录已过期！',
            //             close: false,
            //             cancelText: '登陆',
            //             confirmText: '注册',
            //             cancelCallback: () => {
            //                 this.router.navigateByUrl('login');
            //             },
            //             confirmCallback: () => {
            //                 this.router.navigateByUrl('register');
            //             }
            //         });
            //     });
            // }
        }
    }

    /**
     * 处理请求错误
     * @param error
     */
    private handleError (error) {
        let msg = error.message;
        if (error.status === 400) {
            msg = '请求出错';
        }
        if (error.status === 404) {
            msg = '请检查URL，以确保路径正确';
        }
        if (error.status === 500) {
            msg = '服务器内部错误，请稍后重试';
        }
        this.toast.error(msg || Message.NetWorkError.msg);
    }

    /**
     * 拦截非200请求响应
     * @param result
     * @param options
     * @returns {any}
     */
    private interceptResponse (result, options) {
        if (options && options.response) {
            if (result.body.code !== Message.UOK.code) {
                this.handleResponse(result.body);
                return null;
            }
        } else {
            if (result.code !== Message.UOK.code) {
                this.handleResponse(result);
                return null;
            }
        }
        return result;
    }
}
