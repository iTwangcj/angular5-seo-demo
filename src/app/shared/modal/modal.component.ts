import { AfterViewInit, Compiler, Component, ComponentFactoryResolver, ComponentRef, ElementRef, NgModule, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { modalAnimates } from './modal.anim';

declare const window: any;

export class ModalRef {

    instance: any;

    get data () {
        return this.instance.config.data;
    }

    onCancel () {
        this.instance.cancel();
    }

    onConfirm (data?: any) {
        this.instance.confirm(data);
    }

    showCloseBtn (show: boolean): ModalRef {
        this.instance.config.close = show;
        return this;
    }

    setTitle (title: string): ModalRef {
        this.instance.config.title = title;
        return this;
    }

    setConfirmText (text: string): ModalRef {
        this.instance.config.confirmText = text;
        return this;
    }

    setCancelText (cancel: string): ModalRef {
        this.instance.config.cancelTxt = cancel;
        return this;
    }

    /**
     * if the callBack return true, the layer will be closed
     * e.g.
     * ```typescript
     * lyRef.closeCallback(() => {
	 *  // Other handler
	 *  return true; // close window
	 * });
     * ```
     */
    closeCallback (callBack: () => boolean): ModalRef {
        this.instance.onClose = callBack;
        return this;
    }

    /**
     * confirmCallback called on 'confirm' button click. for alert layer or confirm layer
     * e.g.
     * ```typescript
     * lyRef.confirmCallback(()=>{
	 * 	...do something...
	 * 	return true; // close window
	 * });
     * ```
     */
    confirmCallback (callback: (data?: any) => boolean): ModalRef {
        this.instance.onConfirm = callback;
        return this;
    }

    /**
     * cancelCallback called on "cancel" button click. for confirm layer only
     * e.g.
     * ```typescript
     * lyRef.cancelCallback(()=>{
	 * 	...do something...
	 * 	return true;
	 * });
     * ```
     */
    cancelCallback (cancelCallback: () => boolean): ModalRef {
        this.instance.onCancel = cancelCallback;
        return this;
    }

    /**
     * remove all modal layer
     */
    remove () {
        const children = document.body.children;
        for (let i = 0; i < children.length; i++) {
            const modal = children[i];
            if (modal && modal.tagName === 'APP-MODAL') {
                modal.remove();
            }
        }
    }
}

/**
 * modal wrapper component
 */
@Component({
    selector: 'app-modal',
    providers: [ModalRef],
    template: `
        <div class="modal-scroll">
            <div class="modal-body" #modalBody>
                <div *ngIf="config.title" class="modal-header">{{config.title}}</div>
                <div class="modal-content" #modalComponent></div>
                <div *ngIf="config.cancelText || config.confirmText" class="modal-footer">
                    <button *ngIf="config.cancelText" class="btn btn-default" (click)="cancel()">{{config.cancelText}}</button>
                    <button *ngIf="config.confirmText" class="btn btn-primary" (click)="confirm()">{{config.confirmText}}</button>
                </div>
                <div *ngIf="config.close" (click)="close();" class="close">×</div>
            </div>
        </div>
    `
})
export class ModalComponent implements AfterViewInit {
    thisRef: ComponentRef<any>;
    bodyRef: ComponentRef<any>;
    vcRef: ViewContainerRef;
    bodyEle: any;
    config: any = {};
    layerType: string;
    lyRef: ModalRef;

    @ViewChild('modalBody', { read: ViewContainerRef })
    modalBody: ViewContainerRef;

    @ViewChild('modalComponent', { read: ViewContainerRef })
    modalComponent: ViewContainerRef;

    constructor (vcRef: ViewContainerRef,
                 lyRef: ModalRef,
                 private resolver: ComponentFactoryResolver,
                 private eleRef: ElementRef,
                 private compiler: Compiler,
                 private render: Renderer2) {
        this.lyRef = lyRef;
        this.lyRef.instance = this;
        this.vcRef = vcRef;
    }

    ngAfterViewInit () {
        this.modalBodyStyle('width', this.config.width);
        this.modalBodyStyle('height', this.config.height);
        setTimeout(() => { // fix: ExpressionChangedAfterItHasBeenCheckedError
            const _right = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right') || '0', 10);
            const _width = this.scrollBar();
            if (_width) {
                document.body.style.paddingRight = _right + _width + 'px';
            }
            this.render.addClass(document.body, 'no-scroll');

            this.eleRef.nativeElement.classList.add('modal');
            if (this.config.modalClass) {
                this.eleRef.nativeElement.classList.add(this.config.modalClass);
            }
            this.bodyEle = this.modalBody.element.nativeElement;
            const modalEle = this.modalComponent.element.nativeElement;

            // The non-components situation is initialized
            if (typeof this.config.template === 'string') {
                this.bodyRef = this.createDynamicComponent(this.config.template);
            }
            /* Initialize the popover component */
            if (typeof this.config.template === 'function') {
                const conFactory = this.resolver.resolveComponentFactory(this.config.template);
                this.bodyRef = this.vcRef.createComponent(conFactory, null, this.vcRef.injector);
            }
            modalEle.appendChild(this.bodyRef.location.nativeElement);
            this.render.setStyle(this.bodyEle, 'display', 'block');
            if (this.config.data && this.config.data instanceof Object) {
                (<any>Object).assign(this.bodyRef.instance, this.config.data);
            }
            if (typeof this.config.afterCallback === 'function') {
                this.config.afterCallback();
            }
            if (this.config.animate && this.bodyEle) {
                this.animateInit();
            }
            this.initPosition();
        });
    }

    /**
     * Less than or equal to IE9
     */
    private lteIE9 () {
        return !!(navigator && navigator.appName === 'Microsoft Internet Explorer' &&
            parseInt(navigator.appVersion.split(';')[1].replace(/[ ]/g, '').replace('MSIE', ''), 10) <= 9);
    }

    /**
     * Creating dynamic component
     */
    private createDynamicComponent (template: string) {
        @Component({ template })
        class TemplateComponent {
        }

        @NgModule({ declarations: [TemplateComponent], imports: [CommonModule, RouterModule] })
        class TemplateModule {
        }

        let component: any;
        const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);
        const factory = mod.componentFactories.find((comp) => comp.componentType === TemplateComponent);
        component = this.vcRef.createComponent(factory);
        component.instance.close = () => {
            this.close();
        };
        return component;
    }

    private animateInit (isClose: boolean = false) {
        if (!this.lteIE9()) {
            let animateName = `animate_${this.config.animate.toLowerCase()}`;
            // init keyframes
            const keyframeList = modalAnimates[animateName];
            animateName = isClose ? animateName + '_close' : animateName;
            const animateTiming = this.config.animateTime / 1000 + 's';
            const timingFun = 'cubic-bezier(0.27, 1.12, 0.32, 1.5)';

            // init animation
            this.render.setStyle(this.bodyEle, '-webkit-animation-name', animateName);
            this.render.setStyle(this.bodyEle, '-moz-animation-name', animateName);
            this.render.setStyle(this.bodyEle, '-ms-animation-name', animateName);
            this.render.setStyle(this.bodyEle, 'animation-name', animateName);

            this.render.setStyle(this.bodyEle, '-webkit-animation-duration', animateTiming);
            this.render.setStyle(this.bodyEle, '-moz-animation-duration', animateTiming);
            this.render.setStyle(this.bodyEle, '-ms-animation-duration', animateTiming);
            this.render.setStyle(this.bodyEle, 'animation-duration', animateTiming);

            this.render.setStyle(this.bodyEle, '-webkit-transition-timing-function', timingFun);
            this.render.setStyle(this.bodyEle, '-moz-transition-timing-function', timingFun);
            this.render.setStyle(this.bodyEle, '-ms-transition-timing-function', timingFun);
            this.render.setStyle(this.bodyEle, 'transition-timing-function', timingFun);

            this.render.setStyle(this.bodyEle, '-webkit-animation-fill-mode', 'forwards'); // Animate objects from one place to another and leave it there. (solving scintillation problems)
            this.render.setStyle(this.bodyEle, '-moz-animation-fill-mode', 'forwards');
            this.render.setStyle(this.bodyEle, '-ms-animation-fill-mode', 'forwards');
            this.render.setStyle(this.bodyEle, 'animation-fill-mode', 'forwards');

            const keyframes = `
                @keyframes ${animateName} {
                    0% { ${keyframeList[isClose ? 1 : 0]} }
                    100% { ${keyframeList[isClose ? 0 : 1]} }
                }
            `;
            document.styleSheets.item(0)['insertRule'](keyframes, 0);
        }
    }

    private scrollBar () {
        if (document.body.clientWidth >= window.innerWidth) {
            return 0;
        }
        const scrollDiv = this.render.createElement('div');
        this.render.setStyle(scrollDiv, 'width', '100px');
        this.render.setStyle(scrollDiv, 'height', '100px');
        this.render.setStyle(scrollDiv, 'overflow', 'scroll');
        this.render.setStyle(scrollDiv, 'position', 'absolute');
        this.render.setStyle(scrollDiv, 'top', '99999em');
        this.render.appendChild(document.body, scrollDiv);
        const scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.render.removeChild(document.body, scrollDiv);
        return scrollBarWidth;
    }

    /**
     * set modal width and height
     */
    private modalBodyStyle (key: string, value: any) {
        if (this.modalBody && value) {
            if (/^[0-9]*$/.test(value)) {
                this.modalBody.element.nativeElement.style[key] = `${value}px`;
            } else {
                this.modalBody.element.nativeElement.style[key] = value;
            }
        }
    }

    /**
     * position computations
     */
    private offsets () {
        let style = {};
        const winH = window.innerHeight;
        const divH = this.modalBody.element.nativeElement.offsetHeight;
        const position = this.config.position;
        if (!isNaN(position)) {
            return ['margin-top', position + 'px'];
        }
        const positionTo = position.split('-')[0];
        const number = parseInt(position.split('-')[1], 10) || 0;
        if (positionTo === 'left') {
            style = { 'margin-left': number + 'px', float: 'left' };
        } else if (positionTo === 'right') {
            style = { 'margin-right': number + 'px', float: 'right' };
        } else if (positionTo === 'bottom') {
            style = { 'margin-top': (winH - divH - number) + 'px' };
        } else if (positionTo === 'top') {
            style = { 'margin-top': number + 'px' };
        } else if (positionTo === 'center') {
            if (divH > (winH - 60)) {
                const gapHalf = 60 / 2;
                style = { 'margin-top': gapHalf + 'px', 'margin-bottom': gapHalf + 'px' };
            } else {
                style = { 'margin-top': ((winH - divH) / 2) + 'px' };
            }
        } else {
            style = ['margin-top', (60 / 2) + 'px'];
        }
        return style;
    }

    /**
     * init position
     */
    private initPosition () {
        const position = this.config.position;
        if (position) {
            const styleMap: any = this.offsets();
            for (const key in styleMap) {
                if (key && styleMap.hasOwnProperty(key)) {
                    this.render.setStyle(this.modalBody.element.nativeElement, key, styleMap[key]);
                }
            }
        }
    }

    public onConfirm (data?: any) {
        return data || true;
    }

    public onClose () {
        return true;
    }

    public onCancel (data?: any) {
        return data || true;
    }

    private _callback (callback: Function, data?: any) {
        if (typeof callback === 'function') {
            callback(data);
        }
        return true;
    }

    /**
     * alert or confirm layer
     */
    confirm (data?: any) {
        if (this.onConfirm && this.onConfirm(data)) {
            this.closeWindow();
            this._callback(this.config.confirmCallback, data);
        }
    }

    /**
     * alert or confirm layer
     */
    cancel (data?: any) {
        if (this.onCancel && this.onCancel()) {
            this.closeWindow();
            this._callback(this.config.cancelCallback, data);
        }
    }

    /** close layer */
    close () {
        if (this.onClose && this.onClose()) this.closeWindow();
    }

    /**
     * close modal window
     */
    private closeWindow () {
        const destroyAndResetScroll = () => {
            setTimeout(() => {
                document.body.style.removeProperty('padding-right');
                document.body.classList.remove('no-scroll');
                this.thisRef.destroy();
            }, this.config.animateTime);
        };
        if (this.config.animate) {
            this.animateInit(true);
            destroyAndResetScroll();
        } else {
            destroyAndResetScroll();
        }
    }
}