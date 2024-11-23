// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ListComponent } from './post/list/list.component';  
import { ListUsersComponent } from './post/list-users/list-users.component';  
import { UserEditComponent } from './post/edit-users/edit-users.component';
import { CreateUserComponent } from './post/create-users/create-users.component';



export const routes: Routes = [
    // Routes de mon application
  { path: 'list-users', component: ListUsersComponent }, //liste de utilisateurs
  { path: 'users/edit/:id', component: UserEditComponent },//modifier un utilisateur
  { path: 'users/create', component: CreateUserComponent },//ajouter un utilisateur
  { path: 'list', component: ListComponent }  // Route pour accéder à  ListComponent donnes pour les temperatures
];







