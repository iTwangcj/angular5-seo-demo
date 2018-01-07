import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { routes } from './stat.routes';
import { StatComponent } from './stat.component';

@NgModule({
	imports: [
        SharedModule.forRoot(),
		RouterModule.forChild(routes)
	],
	declarations: [
        StatComponent
	],
	providers: []
})
export class StatModule {
}