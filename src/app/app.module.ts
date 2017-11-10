import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';

import { TestModule } from './test/fe-test';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ang5-seo' }),
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes),

        TestModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
