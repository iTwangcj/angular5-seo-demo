import { Routes } from '@angular/router';
import { ToolsComponent } from './tools.component';
import { ToolsJsonComponent } from './json/json.component';
import { ToolsCssComponent } from './css/css.component';

export const routes: Routes = [
	{
		path: '',
		component: ToolsComponent,
		children: [
			{ path: '', component: ToolsJsonComponent },
			{ path: 'css', component: ToolsCssComponent }
		]
	}
];