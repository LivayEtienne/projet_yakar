import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import du CommonModule pour ngClass
import { WebsocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature-card.component.html',
  standalone: true,
  styleUrls: ['./temperature-card.component.css'],
  imports: [CommonModule] // Ajout de CommonModule pour utiliser ngClass
})
export class TemperatureCardComponent {
  temperature: number | null = null; // Initialisation de la température
  private socketSubscription: Subscription | undefined;
  private updateInterval: any;  // Variable pour stocker l'intervalle

  constructor(private webSocketService: WebsocketService) {}

  ngOnInit(): void {
    this.getTemperature(); // Récupération initiale de la température
    this.startTemperatureUpdates(); // Démarrer la mise à jour périodique de la température
  }

  // Récupérer la température depuis l'API
  getTemperature() {
    this.socketSubscription = this.webSocketService.getMessages().subscribe((message) => {
      if (message.type === 'sensor') {
        this.temperature = message.temperature;
      }
    });
  }

  // Démarrer la mise à jour périodique de la température
  startTemperatureUpdates() {
    this.updateInterval = setInterval(() => {
      this.getTemperature(); // Récupérer la température toutes les X millisecondes (par exemple, toutes les 5 secondes)
    }, 5000); // Mettre à jour toutes les 5 secondes
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

  ngOnDestroy(): void {
    // Se désabonner lors de la destruction du composant
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }

    // Arrêter l'intervalle de mise à jour de la température
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Fermer la connexion WebSocket
    this.webSocketService.closeConnection();
  }
}
