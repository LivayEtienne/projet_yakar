import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TemperatureService } from '../services/temperature.service';
import { Router } from '@angular/router';  // Import du Router
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-weekly-temperature-history',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, RouterModule],
  templateUrl: './weekly-temperature-history.component.html',
  styleUrls: ['./weekly-temperature-history.component.css'],
})
export class WeeklyTemperatureHistoryComponent implements OnInit {
  weeklyData: any[] = []; // Contient les données hebdomadaires
  selectedDayData: any | null = null; // Données du jour sélectionné
  chartData: { name: string; value: number }[] = []; // Données pour le graphique
  isLoading = true; // Indicateur de chargement
  errorMessage = ''; // Message d'erreur

  constructor(
    private temperatureService: TemperatureService,
    private router: Router  // Injection du Router dans le constructeur
  ) {}

  ngOnInit(): void {
    this.fetchWeekHistory();
  }

  /**
   * Récupère l'historique hebdomadaire via le service
   */
  fetchWeekHistory(): void {
    this.isLoading = true; // Démarre le chargement
    this.errorMessage = ''; // Réinitialise les erreurs
    this.temperatureService.getWeekHistory().subscribe({
      next: (data) => {
        this.weeklyData = data || [];
        this.isLoading = false;
        if (this.weeklyData.length === 0) {
          this.errorMessage = 'Aucune donnée disponible pour la semaine.';
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des données :', err);
        this.errorMessage = 'Impossible de charger les données. Réessayez plus tard.';
        this.isLoading = false;
      },
    });
  }

  /**
   * Gère le clic sur un jour pour afficher le graphique
   * @param day Données du jour cliqué
   */
  onDayClick(day: any): void {
    if (!day.averageTemperature && !day.averageHumidity) {
      this.selectedDayData = null; // Pas de données pour ce jour
      this.chartData = [];
      return;
    }

    // Définit les données sélectionnées pour le graphique
    this.selectedDayData = day;
    this.chartData = [
      { name: 'Température moyenne', value: day.averageTemperature || 0 },
      { name: 'Humidité moyenne', value: day.averageHumidity || 0 },
    ];

    console.log('Données pour le graphique :', this.chartData); // Debug
  }

  // Méthode pour naviguer vers la page temperature-table.html
  navigateToTemperatureTable(): void {
    this.router.navigate(['/temperature-table']);  // Redirige vers la page "temperature-table"
  }
}
