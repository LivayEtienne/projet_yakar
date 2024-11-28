import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-moyenne2',
  standalone: true,
  templateUrl: './moyenne2.component.html',
  styleUrls: ['./moyenne2.component.css']
})
export class Moyenne2Component {
  temperature: number | null = null;
  humidity: number | null = null;
  config: { hours: number[], minutes: number[] } = { hours: [], minutes: [] };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.apiService.getRelevesFixes().subscribe((releves) => {
      this.apiService.getConfiguredTimes().subscribe((config) => {
        this.config = config;
        const timeKey = this.createTimeKey(config.hours[1], config.minutes[1]);
        const releve = releves.find(releve => releve.date === timeKey);
        if (releve) {
          this.temperature = releve.temperature;
          this.humidity = releve.humidity;
        }
      });
    });
  }

  createTimeKey(hour: number, minute: number): string {
    return `${hour?.toString().padStart(2, '0')}:${minute?.toString().padStart(2, '0')}`;
  }
}