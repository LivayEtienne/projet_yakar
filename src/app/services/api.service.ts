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

  getRelevesFixes(): Observable<{ time: string, temperature: number, humidity: number }[]> {
    return this.http.get<{ message: string; data: { timestamp: string, temperature: number, humidity: number }[] }>(`${this.apiUrl}/mesures/specific-times`).pipe(
      map(response => {
        const times = ['10:00', '14:00', '17:00']; // Horaires fixes
        return response.data.map((item, index) => ({
          time: times[index] || 'N/A', // Associer les horaires fixes
          temperature: item.temperature,
          humidity: item.humidity,
        }));
      })
    );
  }
  }