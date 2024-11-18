import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-average-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './average-card.component.html',
  styleUrls: ['./average-card.component.css']
})
export class AverageCardComponent {
  averageTemperature: number = 27;
  averageHumidity: number = 30;
}
