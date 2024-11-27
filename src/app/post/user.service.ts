import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './users';  // Modèle utilisateur

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiURL = 'http://localhost:3000/api'; // URL de l'API Node.js pour les utilisateurs

  // Options d'entête HTTP pour les requêtes
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.apiURL}/users`)
      .pipe(catchError(this.errorHandler)); // Gestion des erreurs
  }

  // Récupérer un utilisateur par son ID
  getUserById(id: string): Observable<User> {
    return this.http
      .get<User>(`${this.apiURL}/user/${id}`)
      .pipe(catchError(this.errorHandler)); // Gestion des erreurs
  }

  // Créer un utilisateur
  createUser(user: User): Observable<User> {
    return this.http
      .post<User>(`${this.apiURL}/users`, JSON.stringify(user), this.httpOptions)
      .pipe(catchError(this.errorHandler)); // Gestion des erreurs
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http
      .put<User>(`${this.apiURL}/user/${id}`, JSON.stringify(user), this.httpOptions)
      .pipe(catchError(this.errorHandler)); // Gestion des erreurs
  }
  

  // Supprimer un utilisateur
  deleteUser(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiURL}/user/${id}/archived`, this.httpOptions)
      .pipe(catchError(this.errorHandler)); // Gestion des erreurs
  }

  // Changer le rôle d'un utilisateur
  changeRole(id: string, role: string): Observable<User> {
    return this.http
      .put<User>(`${this.apiURL}/user/${id}/switch-role`, JSON.stringify({ role }), this.httpOptions)
      .pipe(catchError(this.errorHandler)); // Gestion des erreurs
  }

  // Archiver un utilisateur
  archiveUser(id: string): Observable<User> {
    return this.http
      .delete<User>(`${this.apiURL}/user/${id}/archived`, this.httpOptions)
      .pipe(catchError(this.errorHandler)); // Gestion des erreurs
  }

  private errorHandler(error: any): Observable<never> {
    const errorMessage =
      error.error?.message || // Message spécifique du backend
      (error.error instanceof ErrorEvent
        ? error.error.message // Erreur côté client
        : `Code d'erreur : ${error.status}\nMessage : ${error.statusText}`) || 
      'Une erreur inconnue est survenue.';
  
    console.error('Détails de l\'erreur :', error); // Log complet pour débogage
  
    return throwError(() => ({
      status: error.status || 0, // Status peut être inexistant
      message: errorMessage,
    }));
  }
  
  
}
