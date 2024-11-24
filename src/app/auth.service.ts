import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'jwt-secret';

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la connexion :', error);
        return throwError(() => new Error('Erreur de connexion.'));
      })
    );
  }

  loginWithCode(code: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { code }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la connexion avec un code :', error);
        return throwError(() => new Error('Erreur de connexion.'));
      })
    );
  }

  saveToken(token: string): void {
    if (!this.isBrowser()) {
      throw new Error('Cannot save token in a non-browser environment');
    }
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    if (!this.isBrowser()) {
      throw new Error('Cannot get token in a non-browser environment');
    }
    return localStorage.getItem(this.tokenKey);
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

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
