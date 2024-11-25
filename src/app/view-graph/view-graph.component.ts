import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-graph',
  templateUrl: './view-graph.component.html',
  standalone: true,
  styleUrls: ['./view-graph.component.css'],
})
export class ViewGraphComponent implements OnInit {
  public options: any;
  private chart: Highcharts.Chart | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Initialiser le graphique avec des données fictives
    this.initializeGraph();

    // Mettre à jour les données en temps réel toutes les 5 secondes
    setInterval(() => this.updateRealTimeData(), 5000);
  }

  initializeGraph(): void {
    const categories = ['1', '2', '3', '4', '5']; // Points initiaux fictifs
    const tempData = [22, 24, 21, 23, 25]; // Températures fictives
    const humData = [45, 50, 48, 55, 60]; // Humidité fictive

    this.options = {
      chart: {
        type: 'line',
        width: 810,
      },
      title: {
        text: 'Température et humidité en temps réel',
      },
      xAxis: {
        categories,
      },
      yAxis: [
        {
          title: { text: 'Température (°C)' },
          min: 0, // Valeur minimale pour l'axe de température
        },
        {
          title: { text: 'Humidité (%)' },
          opposite: true,
          min: 0, // Valeur minimale pour l'axe d'humidité
        },
      ],
      series: [
        {
          name: 'Température',
          data: tempData,
          yAxis: 0, // Associer à l'axe des températures
        },
        {
          name: 'Humidité',
          data: humData,
          yAxis: 1, // Associer à l'axe des humidités
        },
      ],
    };

    // Initialiser le graphique
    this.chart = Highcharts.chart('container', this.options);
  }

  updateRealTimeData(): void {
    if (!this.chart) return;

    // Récupérer les données de température
    this.apiService.getRealTimeTemperature().subscribe(
      (tempResponse) => {
        const temperature = tempResponse.temperature;
        const timestamp = tempResponse.timestamp;

        // Mettre à jour la série de température
        const tempSeries = this.chart?.series[0];
        tempSeries?.addPoint(temperature, true, tempSeries.data.length >= 10); // Garde un historique de 10 points
      },
      (error) => {
        console.error('Erreur lors de la récupération de la température:', error);
      }
    );

    // Récupérer les données d'humidité
    this.apiService.getRealTimeHumidity().subscribe(
      (humResponse) => {
        const humidity = humResponse.humidity;

        // Mettre à jour la série d'humidité
        const humSeries = this.chart?.series[1];
        humSeries?.addPoint(humidity, true, humSeries.data.length >= 10); // Garde un historique de 10 points
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'humidité:', error);
      }
    );
  }
}