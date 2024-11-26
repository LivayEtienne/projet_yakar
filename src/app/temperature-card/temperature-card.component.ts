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

  constructor(private webSocketService: WebsocketService) {}
  ngOnInit(): void {
    this.getTemperature(); // Récupération de la température au démarrage
  }

  // Récupérer la température depuis l'API
  getTemperature() {
    this.socketSubscription = this.webSocketService.getMessages().subscribe((message) => {
      if (message.type === 'sensor') {
        this.temperature = message.temperature;
      }
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

  ngOnDestroy(): void {
    // Se désabonner lors de la destruction du composant
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    this.webSocketService.closeConnection();
  }
}