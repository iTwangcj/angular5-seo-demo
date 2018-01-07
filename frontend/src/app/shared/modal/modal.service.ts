import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector } from '@angular/core';
import { ModalComponent, ModalRef } from './modal.component';

@Injectable()
export class ModalService {

    constructor (private resolver: ComponentFactoryResolver,
                 private app: ApplicationRef,
                 private _injector: Injector) {
    }

    /**
     * open a dialog window
     *  e.g.
     *  ```typescript
     *        const modalRef = this.modal.dialog({
	 *			data: '123456',
	 *			template: ProjectsAddComponent,
	 *			beforeCallback: () => {
	 *				console.log('打开前执行回调函数.');
	 *			},
	 *			afterCallback: () => {
	 *				console.log('打开后执行回调函数.');
	 *			}
	 *			cancelCallback: () => {
	 *				console.log('取消回调事件[方法一].');
	 *			},
	 *			confirmCallback: () => {
	 *				console.log('确认回调事件[[方法一]].');
	 *			}
	 *		});
     *        modalRef.cancelCallback(() => {
	 *			// Other handler
	 *			console.log('取消回调事件[方法二].');
	 *			return true; // close window
	 *		});
     *        modalRef.confirmCallback(() => {
	 *			// Other handler
	 *			console.log('确认回调事件[方法二].');
	 *			return true;
	 *		});
     *  ```
     *
     * scale, top, bottom, left, right, zoom,
     * rotate, rotatex, rotatey, scalex, scaley
     *
     */
    public dialog (config: ModalConfig): ModalRef {
        const defaults = {
            modalClass: 'modal-dialog',
            animate: 'top',
            position: 'top-60',
            width: 550,
            cancelText: false,
            confirmText: false
        };
        this.mergeConfig(defaults, config);
        return this.initLayerWrapper(defaults, 'dialog');
    }

    /**
     * open a alert window
     * e.g.
     * ```typescript
     * this.modal.alert({ template: 'alert 对话框' });
     * ```
     * scale, top, bottom, left, right, zoom,
     * rotate, rotatex, rotatey, scalex, scaley
     */
    public alert (config?: ModalConfig): ModalRef {
        const defaults = {
            modalClass: 'modal-alert',
            animate: 'zoom',
            cancelText: false
        };
        this.mergeConfig(defaults, config);
        return this.initLayerWrapper(defaults, 'alert');
    }

    /**
     * open a confirm window
     * e.g.
     * ```typescript
     * this.modal.confirm({
	 *  template: '测试文本'
	 * });
     * ```
     */
    public confirm (config?: ModalConfig): ModalRef {
        const defaults = {
            modalClass: 'modal-confirm',
            animate: 'scale'
        };
        this.mergeConfig(defaults, config);
        return this.initLayerWrapper(defaults, 'confirm');
    }

    /**
     * open a loading layer
     * e.g.
     * ```typescript
     * const tip = this.modal.loading({ template: '2秒钟后关闭' })
     * setTimeout(() => {tip.close();}, 2000);
     * ```
     */
    public loading (config?: ModalConfig): ModalRef {
        const defaults = {
            modalClass: 'modal-loading',
            animate: 'loading',
            template: '正在载入',
            autoClose: 3000,
            title: false,
            cancelText: false,
            confirmText: false,
            height: 100,
            width: 260
        };
        this.mergeConfig(defaults, config);
        const modalRef = this.initLayerWrapper(defaults, 'loading');
        if (Number(defaults.autoClose)) {
            setTimeout(() => {
                modalRef.onCancel();
            }, defaults.autoClose);
        }
        return modalRef;
    }

    /**
     * open a actions layer
     */
    public actions (config?: ModalConfig): ModalRef {
        const defaults = {
            modalClass: 'modal-action',
            animate: 'bottom',
            position: 'bottom-20',
            confirmText: false,
            title: false,
            width: '96%'
        };
        this.mergeConfig(defaults, config);
        return this.initLayerWrapper(defaults, 'actions');
    }

    private mergeConfig (defaults: any, config: any) {
        config = config || {};
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                defaults[key] = config[key];
            }
        }
        return config;
    }

    private _callback (callback?: Function) {
        if (typeof callback === 'function') {
            callback();
        }
        return true;
    }

    /**
     * create layer wrapper
     * @param config
     * @param type
     */
    private initLayerWrapper (config: ModalConfig, type: string): ModalRef {

        config = this.defaults(config);

        this._callback(config.beforeCallback);

        const conFactory = this.resolver.resolveComponentFactory(ModalComponent);
        let windowCmpRef: ComponentRef<ModalComponent>;
        const containerEl = document.querySelector('body');
        windowCmpRef = conFactory.create(this._injector);
        this.app.attachView(windowCmpRef.hostView);
        containerEl.appendChild(windowCmpRef.location.nativeElement);

        const instance = windowCmpRef.instance;
        instance.layerType = type;
        instance.config = config;
        instance.thisRef = windowCmpRef;

        // 注册键盘监听事件
        this.keyboardListen(config, instance);

        return instance.lyRef;
    }

    /**
     * 键盘事件监听
     */
    private keyboardListen (config: ModalConfig, instance: any) {
        document.addEventListener('keydown', (event) => {
            if (event.keyCode === 13) { // Enter 回车键
                // 取消事件相关的默认行为
                if (event.preventDefault) { // 标准技术
                    event.preventDefault();
                }
                if (event.returnValue) { // 兼容IE9之前的IE
                    event.returnValue = false;
                }
                return false;   // 用于处理使用对象属性注册的处理程序
            }

            if (config.onEsc && event.keyCode === 27) { // Esc 退出键
                instance.cancel();
            }
        });
    }

    /**
     * default setting
     * @param config
     */
    private defaults (config: ModalConfig): ModalConfig {
        const _defaults: ModalConfig = {
            modalClass: '',
            title: '温馨提示',
            close: true,
            cancelText: '取消',
            confirmText: '确定',
            position: 'center', // top, bottom, right, left 或者 top-20, bottom-20, right-20, left-20
            animate: 'zoom',    // scale, top, bottom, left, right, zoom, rotate, rotatex, rotatey, scalex, scaley
            animateTime: 250,
            onEsc: true,
            template: null,
            width: null,
            height: null,
            autoClose: null,
            beforeCallback: null, // 打开前执行回调函数
            afterCallback: null,  // 打开后执行回调函数
            closeCallback: null,  // 关闭后执行回调函数
            cancelCallback: null, // 取消后执行回调函数
            confirmCallback: null // 确认后执行回调函数
        };
        const keys = Object.keys(_defaults);
        for (const key of keys) {
            if (config[key] === undefined) {
                config[key] = _defaults[key];
            }
        }
        return config;
    }
}

export interface ModalConfig {

    /**
     * 自定义属性
     */
    [key: string]: any;

    /**
     * modal layout class
     */
    modalClass?: string;

    /**
     * The text content
     */
    template?: any;

    /**
     * data pass to dialog component
     */
    data?: any;

    /**
     * dialog title
     * valid only for dialog layer
     */
    title?: any;

    /**
     * show close button or not.
     * valid only for dialog layer
     */
    close?: boolean;

    /**
     * text of "confirm" button.
     * valid for alert or confirm layer
     */
    confirmText?: any;

    /**
     * text of "cancel" button
     * valid only for confirm layer
     */
    cancelText?: any;

    /**
     * defined a animate by a class selector
     * valid for all type layer.
     *
     * existing options:
     * scale, top, bottom, left, right, zoom,
     * rotate, rotatex, rotatey, scalex, scaley
     */
    animate?: any;

    /**
     * modal Animation time
     */
    animateTime?: number;

    /**
     * modal style width
     */
    width?: any;

    /**
     * modal style height
     */
    height?: any;

    /**
     * modal position
     */
    position?: string;

    /**
     * Time automatic closing layer
     */
    autoClose?: any;

    /**
     * Open the keyboard listener event
     * default: true
     */
    onEsc?: boolean;

    beforeCallback?: any; // 打开前执行回调函数
    afterCallback?: any;  // 打开后执行回调函数
    closeCallback?: any;  // 关闭后执行回调函数
    cancelCallback?: any; // 取消后执行回调函数
    confirmCallback?: any; // 确认后执行回调函数
}
