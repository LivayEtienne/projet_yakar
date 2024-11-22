import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'authToken'; // Nom utilisé pour stocker le token

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password});
  }


  loginWithCode(code: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { code });
  }

    /**
   * Stocke le token JWT.
   */
    saveToken(token: string): void {
      if (!this.isBrowser()) {
        throw new Error('Cannot save token in a non-browser environment');
      }
      localStorage.setItem(this.tokenKey, token); // Enregistre le token
    }
  
    /**
     * Récupère le token JWT.
     */
    getToken(): string | null {
      if (!this.isBrowser()) {
        throw new Error('Cannot get token in a non-browser environment');
      }
      return localStorage.getItem(this.tokenKey); // Lit le token
    }
  
    /**
     * Supprime le token JWT pour déconnecter l'utilisateur.
     */
    logout(): void {
      if (!this.isBrowser()) {
        throw new Error('Cannot logout in a non-browser environment');
      }
      this.http.post(`${this.apiUrl}/auth/logout`, null)
      localStorage.removeItem(this.tokenKey); // Supprime le token
      this.router.navigate(['/login']); // Redirige vers la page de connexion
    }
  
    /**
     * Vérifie si un utilisateur est authentifié.
     */
    isAuthenticated(): boolean {
      return !!this.getToken(); // Retourne true si le token existe
    }

 
}
