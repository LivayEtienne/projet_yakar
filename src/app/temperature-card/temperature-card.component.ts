import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature-card.component.html',
  standalone:true,
  styleUrls: ['./temperature-card.component.css']
})
export class TemperatureCardComponent implements OnInit {
  temperature: number | null = null;

  ngOnInit(): void {
    this.getTemperature();
  }

  // Récupérer la température depuis l'API
  getTemperature() {
    axios.get('http://localhost:3000/api/real-time/temperature')
      .then(response => {
        this.temperature = response.data.temperature;
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de la température', error);
      });
  }

  // Calculer le décalage pour l'offset du cercle en fonction de la température
  getProgressOffset(temperature: number, maxTemp: number): number {
    const progress = (temperature / maxTemp) * 100;
    const circumference = 2 * Math.PI * 40; // Rayon du cercle = 40
    return circumference - (progress / 100) * circumference;
  }
}
