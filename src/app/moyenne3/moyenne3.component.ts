import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-moyenne3',
  standalone: true,
  imports: [],
  templateUrl: './moyenne3.component.html',
  styleUrl: './moyenne3.component.css'
})
export class Moyenne3Component {
  temperature: number | null = null;
  humidity: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getRelevesFixes().subscribe((releves) => {
      // Recherche d'un relevé spécifique pour 17h
      const releve17h = releves.find(releve => releve.time === '18:41'); // Utilisez 'time' ici

      if (releve17h) {
        this.temperature = releve17h.temperature;
        this.humidity = releve17h.humidity;
      }
    });
  }
 
}
