// src/app/post/donnees.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Donnee } from './donne';  // Modèle des données

@Injectable({
  providedIn: 'root'
})
export class DonneesService {

  private apiURL = "http://localhost:3000/api/donnes";  // URL de votre API Node.js

  // Options d'entête HTTP pour les requêtes
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Récupérer toutes les données
  getAllDonnes(): Observable<Donnee[]> {
    return this.http.get<Donnee[]>(this.apiURL)
      .pipe(catchError(this.errorHandler));  // Gérer les erreurs
  }

  // Supprimer une donnée par son ID
  deleteDonne(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`, this.httpOptions)
      .pipe(catchError(this.errorHandler));  // Gérer les erreurs
  }

  // Créer une nouvelle donnée
  createDonne(donne: Donnee): Observable<Donnee> {
    return this.http.post<Donnee>(this.apiURL, JSON.stringify(donne), this.httpOptions)
      .pipe(catchError(this.errorHandler));  // Gérer les erreurs
  }

  // Gérer les erreurs HTTP
  private errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
