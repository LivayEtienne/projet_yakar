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

  // Récupérer les relevés à des heures fixes
  getRelevesFixes(): Observable<{ time: string, temperature: number, humidity: number }[]> {
    return this.http.get<{ time: string, temperature: number, humidity: number }[]>(`${this.apiUrl}/releves`).pipe(
      map(data => [
        /*{ time1: '10:00', ...data[0] },
        { time2: '14:00', ...data[1] },
        { time3: '17:00', ...data[2] }*/
        { time1: '10:00', ...data[0] },
        { time2: '14:00', ...data[1] },
        { time3: '17:00', ...data[2] }
      ])
    );
  }
}
