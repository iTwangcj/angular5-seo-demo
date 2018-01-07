import { Routes } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { WorkspaceComponent } from './workspace.component';

export const routes: Routes = [
    {
        path: ':id',
        // canActivate: [AuthService],
        component: WorkspaceComponent
    }
];