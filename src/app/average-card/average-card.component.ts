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
  public averageTemperature: number | null = null;
  public averageHumidity: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getMoyennesDuJour().subscribe((data) => {
      this.averageTemperature = data.averageTemperature;
      this.averageHumidity = data.averageHumidity;
    }, (error) => {
      console.error('Erreur lors de la récupération des moyennes:', error);
    });
  }
}
