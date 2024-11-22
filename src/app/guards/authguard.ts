import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Vérifie si l'utilisateur est authentifié avant d'autoriser l'accès à une route.
   */
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true; // Autorise l'accès
    } else {
      this.router.navigate(['/login']); // Redirige vers la page de connexion
      return false; // Bloque l'accès
    }
  }
}
