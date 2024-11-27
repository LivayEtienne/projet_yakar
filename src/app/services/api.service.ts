import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Récupérer les moyennes journalières
  getMoyennes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/moyennes`);
  }

  // Récupérer l'historique hebdomadaire
  getHistorique(): Observable<any> {
    return this.http.get(`${this.apiUrl}/historique`);
  }

   // Récupérer la température en temps réel
   getRealTimeTemperature(): Observable<any> {
    return this.http.get(`${this.apiUrl}/real-time/temperature`);
  }

  // Récupérer l'humidité en temps réel
  getRealTimeHumidity(): Observable<any> {
    return this.http.get(`${this.apiUrl}/real-time/humidity`);
  }
  getHistoriqueHebdomadaire(): Observable<{ date: string; temperature: number; humidity: number }[]> {
    return this.http.get<{ message: string; data: { date: string; temperature: number; humidity: number }[] }>(`${this.apiUrl}/historique/hebdomadaire`).pipe(
      map(response => response.data) // Assurez-vous de renvoyer uniquement 'data'
    );
  }
  getMoyennesDuJour(): Observable<{ averageTemperature: number; averageHumidity: number }> {
    return this.http.get<{ message: string; averageTemperature: number; averageHumidity: number }>(`${this.apiUrl}/moyennes`).pipe(
      map(response => ({
        averageTemperature: response.averageTemperature,
        averageHumidity: response.averageHumidity,
      }))
    );
  }

  getRelevesFixes(): Observable<{ time: string, temperature: number, humidity: number }[]> {
    return this.http.get<{ data: { time: string, temperature: number, humidity: number }[] }>(`${this.apiUrl}/mesures/specific-times`).pipe(
      map(response => {
        console.log('Données reçues:', response.data);
        return response.data.filter(item => 
          item.temperature !== null && item.humidity !== null
        ); // Filtrer les relevés valides
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des relevés :', error);
        return of([]); // Retourner un tableau vide en cas d'erreur
      })
    );
  }


}