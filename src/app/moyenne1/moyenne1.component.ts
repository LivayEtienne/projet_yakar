import { Component } from '@angular/core';
import {ApiService}  from '../services/api.service';

@Component({
  selector: 'app-moyenne1',
  standalone: true,
  imports: [],
  templateUrl: './moyenne1.component.html',
  styleUrl: './moyenne1.component.css'
})
export class Moyenne1Component {
  temperature: number | null = null;
  humidity: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getMoyennesDuJour().subscribe({
      next: (rest : any) => {
         this.temperature = rest.averageTemperature;
         this.humidity = rest.averageHumidity;
       }, error: (err) => {
         console.error('Erreur lors de la récupération des données :', err);
       }
 });
  }
}