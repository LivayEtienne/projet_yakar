import { Component } from '@angular/core';
import {ApiService}  from '../services/api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone:true,
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  isOn: boolean = false; // État actuel du ventilateur

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Récupérer l'état initial du ventilateur depuis l'API
    this.apiService.getFanState().subscribe({
      next: (response) => {
        this.isOn = response.state;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l’état du ventilateur :', error);
      },
    });
  }

  toggleFan(): void {
    const newState = !this.isOn;
    this.apiService.controlFan(newState).subscribe({
      next: () => {
        this.isOn = newState;
      },
      error: (error) => {
        console.error('Erreur lors du contrôle du ventilateur :', error);
      },
    });
  }
}