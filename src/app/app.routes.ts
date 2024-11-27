import { Routes } from '@angular/router';
import { ListComponent } from './post/list/list.component';
import { ListUsersComponent } from './post/list-users/list-users.component';
import { UserEditComponent } from './post/edit-users/edit-users.component';
import { CreateUserComponent } from './post/create-users/create-users.component';
import { TemperatureTableComponent } from '../components/temperature-table/temperature-table.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/authguard';
import { WeeklyTemperatureHistoryComponent } from './weekly-temperature-history/weekly-temperature-history.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

// Définition des routes de l'application
export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '',  redirectTo: '/login', pathMatch: 'full' },
    { path: 'dashboard',  component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'dashboard/admin', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'dashboard/user', component: UserDashboardComponent, canActivate: [AuthGuard] },
    { path: 'list-users', component: ListUsersComponent, canActivate: [AuthGuard] },
    { path: 'users/edit/:id', component: UserEditComponent, canActivate: [AuthGuard] },
    { path: 'users/create', component: CreateUserComponent, canActivate: [AuthGuard] },
    { path: 'list', component: ListComponent, canActivate: [AuthGuard] },
    { path: 'historiques', component: TemperatureTableComponent,  canActivate: [AuthGuard] },
    { path: 'weekly-history', component: WeeklyTemperatureHistoryComponent, canActivate: [AuthGuard] }  // Nouvelle route pour l'historique de la semaine
];
