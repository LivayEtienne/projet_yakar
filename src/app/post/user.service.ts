import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './users';  // Modèle utilisateur

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiURL = 'http://localhost:3000/api/auth'; // URL de l'API Node.js pour les utilisateurs

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
      .get<User[]>(this.apiURL)
      .pipe(catchError(this.errorHandler)); // Gestion des erreurs
  }

  // Récupérer un utilisateur par son ID
  getUserById(id: string): Observable<User> {
    return this.http
      .get<User>(`${this.apiURL}/${id}`)
      .pipe(catchError(this.errorHandler)); // Gestion des erreurs
  }

  // Créer un utilisateur
  createUser(user: User): Observable<User> {
    return this.http
      .post<User>(`${this.apiURL}/signup`, JSON.stringify(user), this.httpOptions)
      .pipe(catchError(this.errorHandler)); // Gestion des erreurs
  }

  // Mettre à jour un utilisateur
  updateUser(id: string, user: User): Observable<User> {
    return this.http
      .put<User>(`${this.apiURL}/${id}`, JSON.stringify(user), this.httpOptions)
      .pipe(catchError(this.errorHandler)); // Gestion des erreurs
  }

  // Supprimer un utilisateur
  deleteUser(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiURL}/${id}`, this.httpOptions)
      .pipe(catchError(this.errorHandler)); // Gestion des erreurs
  }

  // Changer le rôle d'un utilisateur
  changeRole(id: string, role: string): Observable<User> {
    return this.http
      .put<User>(`${this.apiURL}/changeRole/${id}`, JSON.stringify({ role }), this.httpOptions)
      .pipe(catchError(this.errorHandler)); // Gestion des erreurs
  }

  // Archiver un utilisateur
  archiveUser(id: string): Observable<User> {
    return this.http
      .patch<User>(`${this.apiURL}/archive/${id}`, this.httpOptions)
      .pipe(catchError(this.errorHandler)); // Gestion des erreurs
  }

  // Gérer les erreurs HTTP
  private errorHandler(error: any): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur : ${error.status}\nMessage : ${error.message}`;
    }
    console.error(errorMessage); // Log dans la console
    return throwError(() => errorMessage); // Propager l'erreur
  }
}
