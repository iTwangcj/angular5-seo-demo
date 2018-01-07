import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AccountDbComponent } from './db/db.component';
import { AccountProjectsComponent } from './projects/projects.component';
import { AccountTeamsComponent } from './teams/teams.component';
import { AccountUserComponent } from './users/users.component';
import { AccountMessagesComponent } from './messages/messages.component';
import { AccountSettingsComponent } from './settings/settings.component';
import { AccountComponent } from './account.component';
import { SharedModule } from '../../shared/shared.module';
import { AccountInfoComponent } from './info/info.component';
import { routes } from './account.routes';

@NgModule({
    imports: [
        SharedModule.forRoot(),
        RouterModule.forChild(routes)
    ],
    declarations: [
        AccountComponent,
        AccountDbComponent,
        AccountInfoComponent,
        AccountMessagesComponent,
        AccountProjectsComponent,
        AccountSettingsComponent,
        AccountTeamsComponent,
        AccountUserComponent
    ]
})
export class AccountModule {
}