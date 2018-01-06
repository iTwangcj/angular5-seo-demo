import { ApplicationRef, ComponentFactoryResolver, ComponentRef, ElementRef, Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { SpinComponent } from './spin.component';
import { isPlatformBrowser } from '@angular/common';

/**
 * 旋转服务初始化
 */
@Injectable()
export class SpinManager {

    constructor (private resolver: ComponentFactoryResolver,
                 private app: ApplicationRef,
                 private _injector: Injector,
                 @Inject(PLATFORM_ID) private platformId) {
    }

    init (ele?: ElementRef) {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                const conFactory = this.resolver.resolveComponentFactory(SpinComponent);
                let windowCmpRef: ComponentRef<SpinComponent>;
                windowCmpRef = conFactory.create(this._injector);
                this.app.attachView(windowCmpRef.hostView);
                if (ele) {
                    ele.nativeElement.appendChild(windowCmpRef.location.nativeElement);
                } else {
                    const containerEl = document.querySelector('body');
                    containerEl.appendChild(windowCmpRef.location.nativeElement);
                }
            });
        }
    }
}