import { Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { AccountInfoComponent } from './info/info.component';
import { AccountSettingsComponent } from './settings/settings.component';
import { AccountMessagesComponent } from './messages/messages.component';
import { AccountUserComponent } from './users/users.component';
import { AccountTeamsComponent } from './teams/teams.component';
import { AccountProjectsComponent } from './projects/projects.component';
import { AccountDbComponent } from './db/db.component';
import { AuthService } from '../../service/auth.service';

export const routes: Routes = [
	{
		path: '',
		component: AccountComponent,
        // canActivate: [AuthService],
		children: [
			{ path: '', component: AccountInfoComponent },
			{ path: 'settings', component: AccountSettingsComponent },
			{ path: 'messages', component: AccountMessagesComponent },
			{ path: 'users', component: AccountUserComponent },
			{ path: 'teams', component: AccountTeamsComponent },
			{ path: 'projects', component: AccountProjectsComponent },
			{ path: 'db', component: AccountDbComponent }
		]
	}
];