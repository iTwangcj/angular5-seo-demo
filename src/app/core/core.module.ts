import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { PrivilegeComponent } from './privilege/privilege.component';
import { BrowserComponent } from './browser/browser.component';
import { ErrorComponent } from './error/error.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        HeaderComponent,
        FooterComponent
    ],
    providers: [],
    declarations: [
        HeaderComponent,
        FooterComponent,
        PrivilegeComponent,
        BrowserComponent,
        ErrorComponent
    ],
    entryComponents: []
})
export class CoreModule {
    constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule 已经装载，请仅在 AppModule 中引入该模块。');
        }
    }
}
