import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-moyenne1',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './moyenne1.component.html',
  styleUrls: ['./moyenne1.component.css']
})
export class Moyenne1Component {
  temperature: number | null = null;
  humidity: number | null = null;
  configHours: string = '';
  configMinutes: string = '';
  heuresConfig: string[] = []; // Liste des heures configurées
  releves: { [key: string]: { temperature: number; humidity: number } } = {}; // Typage corrigé

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadConfiguredTimes();
  }

  loadConfiguredTimes(): void {
    this.apiService.getConfiguredTimes().subscribe((config) => {
      // Crée une liste de plages horaires à partir des heures et minutes
      const hours = config.hours;
      const minutes = config.minutes;
      this.heuresConfig = hours.flatMap((h: number) =>
        minutes.map((m: number) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
      );

      // Charger les données pour chaque plage horaire configurée
      this.loadAllReleves();
    });
  }

  loadAllReleves(): void {
    this.apiService.getRelevesFixes().subscribe((releves) => {
      // Mapper chaque relevé à son heure exacte (par exemple 15:00, 15:01, 15:02)
      this.releves = releves.reduce((acc, releve) => {
        acc[releve.time] = { temperature: releve.temperature, humidity: releve.humidity };
        return acc;
      }, {} as { [key: string]: { temperature: number; humidity: number } });
    });
  }

  onSubmit(): void {
    const hours = this.configHours.split(',').map(h => parseInt(h.trim(), 10));
    const minutes = this.configMinutes.split(',').map(m => parseInt(m.trim(), 10));

    this.apiService.setConfiguredTimes(hours, minutes).subscribe(() => {
      alert('Configuration enregistrée avec succès.');
      this.loadConfiguredTimes(); // Recharger les données après mise à jour
    });
  }
}
