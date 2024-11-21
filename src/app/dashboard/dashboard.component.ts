import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  errorMessage: any;
  
  constructor(private authService: AuthService, private router: Router) { }

  logout(){
    this.authService.logout().subscribe({
      next: (res: any) => {
        this.router.navigate(['/login'])
      },
      error: (err) => {
        this.errorMessage = err.error?.msg || 'Une erreur inconnue est survenue.';
      },
    });;
  }


}
