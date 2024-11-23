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
  public moyennes: any = {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Remplacer l'appel API par des données fictives
    const categories = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    
    // Données fictives pour les moyennes de température et d'humidité
    const tempData = [22, 24, 21, 23, 25, 26, 24]; // Températures fictives
    const humData = [45, 50, 48, 55, 60, 65, 55]; // Humidité fictive

    this.options = {
      chart: {
        type: 'line',
      },
      title: {
        text: 'Évolution des températures et de l\'humidité',
      },
      xAxis: {
        categories,
      },
      yAxis: [{
        title: { text: 'Température (°C)' },
        min: 0,
      },
      {
        title: { text: 'Humidité (%)' },
        opposite: true,
      }],
      series: [
        { name: 'Température', data: tempData },
        { name: 'Humidité', data: humData },
      ],
    };

    Highcharts.chart('container', this.options); // Utilisez le même ID que dans le HTML
  }
}