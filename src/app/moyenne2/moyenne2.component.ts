import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-moyenne2',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './moyenne2.component.html',
  styleUrls: ['./moyenne2.component.css']
})
export class Moyenne2Component {
  temperature: number | null = null;
  humidity: number | null = null;
  configHours: string = '';
  configMinutes: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData('14:00');
    this.loadConfiguredTimes();
  }

  loadData(time: string): void {
    this.apiService.getRelevesFixes().subscribe((releves) => {
      const releve = releves.find(releve => releve.time === time);
      if (releve) {
        this.temperature = releve.temperature;
        this.humidity = releve.humidity;
      }
    });
  }

  loadConfiguredTimes(): void {
    this.apiService.getConfiguredTimes().subscribe((config) => {
      this.configHours = config.hours.join(',');
      this.configMinutes = config.minutes.join(',');
    });
  }

  onSubmit(): void {
    const hours = this.configHours.split(',').map(h => parseInt(h.trim(), 10));
    const minutes = this.configMinutes.split(',').map(m => parseInt(m.trim(), 10));

    this.apiService.setConfiguredTimes(hours, minutes).subscribe(() => {
      alert('Configuration enregistrée avec succès.');
    });
  }
}