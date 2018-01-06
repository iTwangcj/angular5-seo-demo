import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { teamsRoutes } from './teams.routes';
import { TeamsComponent } from './teams.component';
import { SharedModule } from '../../shared/shared.module';
import { EditTeamComponent } from './edit/edit.component';

@NgModule({
    imports: [
        SharedModule.forRoot(),
        RouterModule.forChild(teamsRoutes)
    ],
    declarations: [
        TeamsComponent,
        EditTeamComponent
    ],
    entryComponents: [
        EditTeamComponent
    ]
})
export class TeamsModule {
}