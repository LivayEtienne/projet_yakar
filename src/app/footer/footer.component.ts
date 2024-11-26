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
  isDisabled: boolean = false; // État du bouton (désactivé ou non)

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Récupérer l'état initial du ventilateur depuis l'API
    this.apiService.getFanState().subscribe({
      next: (response) => {
        this.isOn = response.state; // Met à jour l'état du ventilateur
        this.isDisabled = response.state; // Désactive le bouton si le ventilateur est déjà allumé
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l’état du ventilateur :', error);
      }
    });
  }

  // Méthode pour allumer/éteindre le ventilateur
  toggleFan(): void {
    const newState = !this.isOn; // Calculer le nouvel état du ventilateur
    this.apiService.controlFan(newState).subscribe({
      next: () => {
        this.isOn = newState; // Met à jour l'état local du ventilateur
        this.isDisabled = newState; // Désactiver le bouton si le ventilateur est allumé
      },
      error: (error) => {
        console.error('Erreur lors du contrôle du ventilateur :', error);
      }
    });
  }
}