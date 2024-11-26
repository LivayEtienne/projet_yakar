import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-humidity-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './humidity-card.component.html',
  styleUrls: ['./humidity-card.component.css']
})
export class HumidityCardComponent {
  humidity: number = 40;
  progress: number = 89;
  timestamp: Date | null = null;
  private socketSubscription: Subscription | undefined;


  constructor(private webSocketService: WebsocketService) {}
  ngOnInit(): void {
    this.getRealTimeHumidity();
  
  }
  
  getRealTimeHumidity() {
    

    // Écoute des données reçues
    this.socketSubscription = this.webSocketService.getMessages().subscribe((message) => {
      if (message.type === 'sensor') {
        this.humidity = message.humidity;
      }
    });
  }

  ngOnDestroy(): void {
    // Se désabonner lors de la destruction du composant
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    this.webSocketService.closeConnection();
  }
}

