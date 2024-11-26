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
  }
}