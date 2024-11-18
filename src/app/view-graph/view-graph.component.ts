import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-view-graph',
  templateUrl: './view-graph.component.html',
  standalone: true,
  styleUrls: ['./view-graph.component.css']
})
export class ViewGraphComponent implements OnInit {
  public options: any = {
    chart: {
      type: 'line',
      width: 810,
      height: 450 // Hauteur ajustée pour plus de visibilité
    },
    title: {
      text: 'Évolution des températures et de l\'humidité'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      tickmarkPlacement: 'on',
      title: {
        text: 'Jours'
      }
    },
    yAxis: [
      { // Axe Y pour la température
        title: {
          text: 'Température (°C)'
        },
        labels: {
          format: '{value}°C'
        },
        min: 0, // Valeur minimale pour la température
        max: 50, // Valeur maximale pour la température
        opposite: false // Positionné à gauche
      },
      { // Axe Y pour l'humidité
        title: {
          text: 'Humidité (%)'
        },
        labels: {
          format: '{value} %'
        },
        min: 0, // Valeur minimale pour l'humidité
        max: 100, // Valeur maximale pour l'humidité
        opposite: true // Positionné à droite
      }
    ],
    tooltip: {
      shared: true // Combine les infobulles des séries
    },
    series: [
      {
        name: 'Température',
        type: 'line',
        data: [20, 35, 19, 27, 22, 24, 28],
        yAxis: 0, // Associe cette série au premier axe Y (température)
        tooltip: {
          valueSuffix: '°C'
        }
      },
      {
        name: 'Humidité',
        type: 'line',
        data: [25, 33, 10, 18, 30, 29, 20],
        yAxis: 1, // Associe cette série au second axe Y (humidité)
        tooltip: {
          valueSuffix: ' %'
        }
      }
    ]
  };

  constructor() { }

  ngOnInit() {
    Highcharts.chart('container', this.options);
  }
}
