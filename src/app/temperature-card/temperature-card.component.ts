import { Component } from '@angular/core';
import axios from 'axios';
import { CommonModule } from '@angular/common'; // Import du CommonModule pour ngClass

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature-card.component.html',
  standalone: true,
  styleUrls: ['./temperature-card.component.css'],
  imports: [CommonModule] // Ajout de CommonModule pour utiliser ngClass
})
export class TemperatureCardComponent {
  temperature: number | null = null; // Initialisation de la température

  ngOnInit(): void {
    this.getTemperature(); // Récupération de la température au démarrage
   
  }

  // Récupérer la température depuis l'API
  getTemperature() {
    axios.get('http://localhost:3000/api/real-time/temperature')
      .then(response => {
        this.temperature = response.data.temperature; // Mise à jour de la température
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de la température', error);
      });
  }

  // Calculer l'offset pour le cercle SVG basé sur la température
  getProgressOffset(temperature: number, maxTemp: number): number {
    const progress = (temperature / maxTemp) * 100;
    const circumference = 2 * Math.PI * 40; // Rayon du cercle = 40
    return circumference - (progress / 100) * circumference;
  }

  // Déterminer la classe CSS pour le fond en fonction de la température
  getTemperatureCardClass(): string {
    return this.temperature !== null && this.temperature > 27 ? 'hot' : 'normal';
  }
}
