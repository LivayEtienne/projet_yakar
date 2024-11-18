import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
}
