import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'jwt-secret';

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      catchError(this.handleError)
    );
  }

  loginWithCode(code: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { code }).pipe(
      catchError(this.handleError)
    );
  }

  saveToken(token: string): void {
    if (!this.isBrowser()) {
      throw new Error('Cannot save token in a non-browser environment');
    }
    localStorage.setItem(this.tokenKey, token);
  }


  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      console.error('Token cannot be retrieved in a non-browser environment');
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }
  

  logout(): void {
    if (!this.isBrowser()) {
      throw new Error('Cannot logout in a non-browser environment');
    }
    this.http.post(`${this.apiUrl}/auth/logout`, null).subscribe({
      next: () => {
        console.log('Déconnexion réussie');
        localStorage.removeItem(this.tokenKey);
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('Erreur lors de la déconnexion :', err)
    });
  }
  private handleError(error: HttpErrorResponse) {
    // Log l'erreur complète dans la console pour le débogage
    console.error('Erreur lors de la connexion:', error);

    // Vérifier si l'erreur est une 401 (Unauthorized)
    if (error.status) {
      // Si l'erreur contient un message dans `error.error.msg`, on peut y accéder comme ceci
      const errorMsg = error.error?.msg || 'Une erreur inconnue est survenue';
      return throwError(errorMsg); // On renvoie le message d'erreur
    }

    // Pour d'autres erreurs, on retourne une erreur générique
    return throwError('Erreur de connexion, veuillez réessayer plus tard.');
  }

}
