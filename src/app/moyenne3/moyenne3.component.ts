import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-moyenne3',
  standalone: true,
  templateUrl: './moyenne3.component.html',
  styleUrls: ['./moyenne3.component.css']
})
export class Moyenne3Component {
  temperature: number | null = null;
  humidity: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getRelevesFixes().subscribe((releves) => {
      const releve1802 = releves.find(releve => releve.time === '18:02');
      if (releve1802) {
        this.temperature = releve1802.temperature;
        this.humidity = releve1802.humidity;
      }
    });
  }
}