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
    this.apiService.getRelevesFixes().subscribe((releves) => {
      const releve1800 = releves.find(releve => releve.time === '18:00');
      if (releve1800) {
        this.temperature = releve1800.temperature;
        this.humidity = releve1800.humidity;
      }
    });
  }
}