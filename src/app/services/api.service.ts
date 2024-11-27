import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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
    return this.http.get<{ message: string; averageTemperature: number; averageHumidity: number }>(`${this.apiUrl}/moyennes/jour`).pipe(
      map(response => ({
        averageTemperature: response.averageTemperature,
        averageHumidity: response.averageHumidity,
      }))
    );
  }
  
  getFanState(): Observable<{ state: boolean }> {
    return this.http.get<{ state: boolean }>(`${this.apiUrl}/state`);
  }

  controlFan(state: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/control`, { state });
  }
  getConfiguredTimes(): Observable<{ hours: number[], minutes: number[] }> {
    return this.http.get<{ hours: number[], minutes: number[] }>(`${this.apiUrl}/configure-times`);
  }
  
  setConfiguredTimes(hours: number[], minutes: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/configure-times`, { hours, minutes });
  }
  
  

  getRelevesFixes(): Observable<{ time: string; temperature: number; humidity: number }[]> {
    return this.http
      .get<{ message: string; data: { timestamp: string; temperature: number; humidity: number }[] }>(
        `${this.apiUrl}/mesures/specific-times`
      )
      .pipe(
        map(response => {
          return response.data.map(item => ({
            time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Format HH:MM
            temperature: item.temperature,
            humidity: item.humidity,
          }));
        })
      );
  }

  
}