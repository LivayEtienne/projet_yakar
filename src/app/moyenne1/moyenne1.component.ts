import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-moyenne1',
  standalone: true,
  templateUrl: './moyenne1.component.html',
  styleUrls: ['./moyenne1.component.css']
})
export class Moyenne1Component {
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
        const timeKey = this.createTimeKey(config.hours[0], config.minutes[0]);
        const releve = releves.find(releve => releve.time === timeKey);
        if (releve) {
          this.temperature = releve.temperature;
          this.humidity = releve.humidity;
        }
      });
    });
  }

  createTimeKey(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }
}