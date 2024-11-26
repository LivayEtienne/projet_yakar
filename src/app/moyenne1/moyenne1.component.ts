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
      const releve10h = releves.find(releve => releve.time === '10:00');
      if (releve10h) {
        this.temperature = releve10h.temperature;
        this.humidity = releve10h.humidity;
      }
    });
  
  }
}