import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './docs.routes';
import { DocsComponent } from './docs.component';

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	declarations: [
		DocsComponent
	]
})
export class DocsModule {
}