import { Component, OnInit } from '@angular/core';
import { TemperatureService } from '../../services/temperature.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';  // Import du Router
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-temperature-table',
  standalone: true,
  imports: [NgxChartsModule, RouterModule],  // Ajoutez RouterModule ici
  templateUrl: './temperature-table.component.html',
  styleUrls: ['./temperature-table.component.css'] 
})
export class TemperatureTableComponent implements OnInit {
  temperatures: any[] = []; // Contiendra la liste des données récupérées
  selectedTemperature: any | null = null; // Donnée sélectionnée pour le diagramme
  averageTemperature: number | null = null; // Moyenne de température pour la date sélectionnée
  averageHumidity: number | null = null;    // Moyenne d'humidité pour la date sélectionnée

  constructor(private temperatureService: TemperatureService, private router: Router) {}  // Injection du Router

  ngOnInit(): void {
    this.fetchTemperatures();
  }

  fetchTemperatures(): void {
    // Utilisation de la méthode correcte du service pour récupérer les températures
    this.temperatureService.getTemperatures().subscribe({
      next: (data) => {
        this.temperatures = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des données :', err);
      }
    });
  }

  fetchAverageTemperature(date: string): void {
    this.temperatureService.getTemperatureAverage(date).subscribe({
      next: (data) => {
        // On accède à averageTemperature et averageHumidity directement
        this.averageTemperature = data.averageTemperature;
        this.averageHumidity = data.averageHumidity;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de la moyenne :', err);
      }
    });
  }

  onRowClick(temperature: any): void {
    this.selectedTemperature = temperature;
    const date = new Date(temperature.date).toISOString().split('T')[0]; // Formater la date pour être au format YYYY-MM-DD
    this.fetchAverageTemperature(date); // Calculer la moyenne pour la date de la température sélectionnée
  }

  // Méthode pour naviguer vers l'historique de la semaine
  navigateToWeekHistory(): void {
    this.router.navigate(['/weekly-history']);  // Utilisation de router pour naviguer
  }
}
