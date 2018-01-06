import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { CoreModule } from './core/core.module';
import { PagesComponent } from './pages/pages.component';
import { ToastModule, ToastOptions } from 'ng2-toastr';
import { SharedModule } from './shared/shared.module';
import { CUSTOM_ERROR_MESSAGES } from './shared/validate';
import { CUSTOM_PATTERN_MESSAGE } from './shared/validate-pattern';
import { HttpService } from './service/http.service';
import { AuthService } from './service/auth.service';
import { SecureModule } from './secure/secure.module';

export class CustomOption {
    animate = 'flyRight'; // you can pass any options to override defaults
    newestOnTop = false;
    showCloseButton = false;
    dismiss = 'auto';
    maxShown = 1; // 最大显示数量
    toastLife = 3000; // 显示时间
    positionClass = 'toast-bottom-right';
}

@NgModule({
    declarations: [
        AppComponent,
        PagesComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ang5-seo' }),
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        SecureModule,
        SharedModule.forRoot(),
        ToastModule.forRoot(),
        RouterModule.forRoot(appRoutes)
    ],
    providers: [
        { provide: ToastOptions, useClass: CustomOption },
        { provide: CUSTOM_ERROR_MESSAGES, useValue: CUSTOM_PATTERN_MESSAGE },
        HttpService,
        AuthService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
