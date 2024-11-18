import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-temperature-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temperature-card.component.html',
  styleUrls: ['./temperature-card.component.css']
})
export class TemperatureCardComponent {
  temperature: number = 28;
  progress: number = 30;
}
