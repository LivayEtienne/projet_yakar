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
      const releve = releves.find(r => r.time);
      if (releve) {
        this.temperature = releve.temperature;
        this.humidity = releve.humidity;
      }
    });
  }

}
