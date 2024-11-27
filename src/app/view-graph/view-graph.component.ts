import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { WebsocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-graph',
  templateUrl: './view-graph.component.html',
  standalone: true,
  styleUrls: ['./view-graph.component.css'],
})
export class ViewGraphComponent implements OnInit {
  public options: any;
  private chart: Highcharts.Chart | null = null;
  public sensorData: { temperature: number; humidity: number } = { temperature: 0, humidity: 0 };
  private socketSubscription: Subscription | undefined;

  constructor(private webSocketService: WebsocketService) {}

  ngOnInit(): void {
    // Initialiser le graphique avec des données fictives
    this.initializeGraph();

    this.socketSubscription = this.webSocketService.getMessages().subscribe((data) => {
      
        this.sensorData.temperature = data.temperature;
        this.sensorData.humidity = data.humidity;
    });
    // Mettre à jour les données en temps réel toutes les 5 secondes
    setInterval(() => this.updateRealTimeData(), 1000);
  }

  initializeGraph(): void {
    const categories = ['1', '2', '3', '4', '5']; // Points initiaux fictifs
    const tempData = [22, 24, 21, 23, 25]; // Températures fictives
    const humData = [45, 50, 48, 55, 60]; // Humidité fictive
    //const tempData = this.sensorData.temperature;
   // const humData = this.sensorData.humidity ;

    this.options = {
      chart: {
        type: 'line',
        width: 700,
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

    this.socketSubscription = this.webSocketService.getMessages().subscribe((message) => {
      if (message.type === 'sensor') {
        this.sensorData.temperature = message.temperature;
        this.sensorData.humidity = message.humidity;
        
      }
      const tempSeries = this.chart?.series[0];
      tempSeries?.addPoint(this.sensorData.temperature, true, tempSeries.data.length >= 10); // Garde un historique de 10 points

       // Mettre à jour la série d'humidité
       const humSeries = this.chart?.series[1];
       humSeries?.addPoint(this.sensorData.humidity, true, humSeries.data.length >= 10); // Garde un historique de 10 points
    });
  }
  

  ngOnDestroy(): void {
    // Se désabonner lors de la destruction du composant
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    this.webSocketService.closeConnection();
  }
    
  }
