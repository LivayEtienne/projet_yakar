import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService}  from '../services/api.service';

@Component({
  selector: 'app-humidity-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './humidity-card.component.html',
  styleUrls: ['./humidity-card.component.css']
})
export class HumidityCardComponent {
  humidity: number = 40;
  progress: number = 89;
  timestamp: Date | null = null;
  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    this.getRealTimeHumidity();
  
  }
  
  getRealTimeHumidity() {
    this.apiService.getRealTimeHumidity().subscribe(
      (data) => {
        this.humidity = data.humidity;
        this.timestamp = new Date(data.timestamp);
        console.log('Humidité en temps réel:', data);
      },
      (error) => {
        console.error('Erreur en récupérant l\'humidité en temps réel:', error);
      }
    );
  }
}

