// src/app/app.component.ts
// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // Importation de RouterModule pour gérer la navigation
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
    selector: 'app-root', // Marque AppComponent comme autonome
    standalone:true,
    imports: [RouterModule, ThemeToggleComponent], // Assurez-vous d'importer RouterModule ici
    template: `
    <router-outlet></router-outlet>  <!-- Le router-outlet pour afficher les composants -->`
})
export class AppComponent {}




