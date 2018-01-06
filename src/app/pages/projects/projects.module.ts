import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { projectsRoutes } from './projects.routes';

import { SharedModule } from '../../shared/shared.module';
import { ProjectsComponent } from './projects.component';
import { EditProjectComponent } from './edit/edit.component';

@NgModule({
    imports: [
        SharedModule.forRoot(),
        RouterModule.forChild(projectsRoutes)
    ],
    declarations: [
        ProjectsComponent,
        EditProjectComponent
    ],
    providers: [],
    entryComponents: [
        EditProjectComponent
    ]
})
export class ProjectsModule {
}