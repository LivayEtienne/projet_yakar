import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/authguard';


export const routes: Routes = [
    { path: 'login', component: LoginComponent ,  },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'dashboard/admin', component: DashboardComponent, canActivate: [AuthGuard]},

  ];
  
