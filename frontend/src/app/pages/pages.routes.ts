import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthService } from '../service/auth.service';

export const PagesRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'teams',
        canActivate: [AuthService],
        loadChildren: './teams/teams.module#TeamsModule'
    },
    {
        // path: 'projects/:teamId',
        path: 'projects',
        canActivate: [AuthService],
        loadChildren: './projects/projects.module#ProjectsModule'
    },
    {
        path: 'workspace',
        canActivate: [AuthService],
        loadChildren: './workspace/workspace.module#WorkspaceModule'
    },
    {
        path: 'account',
        canActivate: [AuthService],
        loadChildren: './account/account.module#AccountModule'
    },
    {
        path: 'stat',
        loadChildren: './stat/stat.module#StatModule'
    },
    {
        path: 'docs',
        loadChildren: './docs/docs.module#DocsModule'
    }
    /*{
        path: 'tools',
        loadChildren: './tools/tools.module#ToolsModule'
    }*/
];
