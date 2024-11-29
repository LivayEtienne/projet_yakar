import { Component } from '@angular/core';
import { WebsocketService } from '../web-socket.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone:true,
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  isOn: boolean = true; // État du ventilateur

  constructor(private webSocket: WebsocketService){}

  toggleFan() {
    this.webSocket.sendMessage(this.isOn); // Envoyer 'true' ou 'false'
    this.isOn = !this.isOn; // Change l'état du ventilateur
  }
}