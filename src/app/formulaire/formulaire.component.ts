import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Pour [(ngModel)]
import { ApiService } from '../services/api.service'; // Service pour les requêtes API
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.css'],
})
export class FormulaireComponent {
  configHours: string[] = ['', '', '']; // Tableau pour trois heures
  configMinutes: string[] = ['', '', '']; // Tableau pour trois minutes
  isModalVisible: boolean = false; // Contrôle l'affichage du modal

  // Définition des heures et minutes disponibles
  availableHours: string[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  availableMinutes: string[] = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Charger les heures configurées au démarrage
    this.apiService.getConfiguredTimes().subscribe((config) => {
      this.configHours = config.hours.map(String); // Convertit les heures en chaînes
      this.configMinutes = config.minutes.map(String); // Convertit les minutes en chaînes
    });
  }

  onSubmit(): void {
    // Conversion des heures et minutes en tableaux de nombres
    const hours = this.configHours.map(h => parseInt(h, 10));
    const minutes = this.configMinutes.map(m => parseInt(m, 10));

    // Appeler l'API pour enregistrer les nouvelles valeurs
    this.apiService.setConfiguredTimes(hours, minutes).subscribe(() => {
      alert('Configuration enregistrée avec succès.');
      this.closeModal(); // Fermer le modal après soumission
    });
  }

  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}