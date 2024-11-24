import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone:true,
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  isOn: boolean = false; // État du ventilateur

  toggleFan() {
    this.isOn = !this.isOn; // Change l'état du ventilateur
    const command = this.isOn ? 'FAN_ON' : 'FAN_OFF';
    this.sendCommandToArduino(command);
  }

  sendCommandToArduino(command: string) {
    // Simulation de l'envoi d'une commande à Arduino
    console.log(`Commande envoyée : ${command}`);
    // Implémentez ici l'envoi de commande via WebSocket ou autre méthode
  }
}