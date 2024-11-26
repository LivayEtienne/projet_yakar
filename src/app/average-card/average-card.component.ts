import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService}  from '../services/api.service';


@Component({
  selector: 'app-average-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './average-card.component.html',
  styleUrls: ['./average-card.component.css']
})
export class AverageCardComponent {
  averageTemperature: number | null = null;
  averageHumidity: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getDailyAverages();
  }

  // Récupérer les moyennes journalières
  getDailyAverages(): void {
    this.apiService.getMoyennes().subscribe(
      (data) => {
        this.averageTemperature = data.avgTemp;
        this.averageHumidity = data.avgHumidity;
      },
      (error) => {
        console.error('Erreur en récupérant les moyennes journalières:', error);
      }
    );
  }
}
