import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { routes } from './workspace.routes';
import { WorkspaceComponent } from './workspace.component';
import { EditInterfaceComponent } from './edit-Interface/edit-Interface.component';
import { EditFolderComponent } from './edit-folder/edit-folder.component';
import { RunnerComponent } from './runner/runner.component';

@NgModule({
	imports: [
        SharedModule.forRoot(),
		RouterModule.forChild(routes)
	],
	declarations: [
		WorkspaceComponent,
        EditInterfaceComponent,
        EditFolderComponent,
        RunnerComponent
	],
	providers: [],
    entryComponents: [
        EditInterfaceComponent,
        EditFolderComponent,
        RunnerComponent
    ]
})
export class WorkspaceModule {
}