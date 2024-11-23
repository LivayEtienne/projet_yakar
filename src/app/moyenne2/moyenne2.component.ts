import { Component } from '@angular/core';
import {ApiService}  from '../services/api.service';
@Component({
  selector: 'app-moyenne2',
  standalone: true,
  imports: [],
  templateUrl: './moyenne2.component.html',
  styleUrl: './moyenne2.component.css'
})
export class Moyenne2Component {
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
