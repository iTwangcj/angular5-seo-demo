import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule, ToastOptions } from 'ng2-toastr';

import { AppRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { PagesComponent } from './pages/pages.component';
import { HttpService } from './service/http.service';
import { CUSTOM_ERROR_MESSAGES } from './shared/validate';
import { CUSTOM_PATTERN_MESSAGE } from './shared/validate-pattern';
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
        BrowserModule.withServerTransition({ appId: 'mock-appId' }),
        HttpClientModule,
        BrowserAnimationsModule,
        CoreModule,
        SecureModule,
        SharedModule.forRoot(),
        ToastModule.forRoot(),
        RouterModule.forRoot(AppRoutes)
    ],
    providers: [
        { provide: ToastOptions, useClass: CustomOption },
        { provide: CUSTOM_ERROR_MESSAGES, useValue: CUSTOM_PATTERN_MESSAGE },
        HttpService,
        AuthService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}