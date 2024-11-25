import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemperatureService {
  private baseUrl = 'http://localhost:3000/api'; // URL de votre backend

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer l'historique des températures et humidités
  getTemperatures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/temperatures/historique`);
  }

  // Méthode pour obtenir la moyenne des températures pour une journée donnée
  getTemperatureAverage(date: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/average/${date}`);
  }
  
 // Méthode pour obtenir l'historique des températures pour la semaine
 getWeekHistory(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/temperatures/historique-semaine`);
}
}
