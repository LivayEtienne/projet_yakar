import { Component, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Pour [(ngModel)]
import { ApiService } from '../services/api.service'; // Service pour les requêtes API
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.css'],
})
export class FormulaireComponent {
  configHours: string = ''; // Chaîne CSV pour les heures
  configMinutes: string = ''; // Chaîne CSV pour les minutes
  isModalVisible: boolean = false; // Contrôle l'affichage du modal

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Charger les heures configurées au démarrage
    this.apiService.getConfiguredTimes().subscribe((config) => {
      this.configHours = config.hours.join(','); // Convertit les heures en chaîne CSV
      this.configMinutes = config.minutes.join(','); // Convertit les minutes en chaîne CSV
    });
  }

  onSubmit(): void {
    // Conversion des chaînes CSV en tableaux de nombres
    const hours = this.configHours.split(',').map((h) => parseInt(h.trim(), 10));
    const minutes = this.configMinutes.split(',').map((m) => parseInt(m.trim(), 10));

    // Appeler l'API pour enregistrer les nouvelles valeurs
    this.apiService.setConfiguredTimes(hours, minutes).subscribe(() => {
      alert('Configuration enregistrée avec succès.');
      this.closeModal(); // Fermer le modal après soumission
    });
  }

  // Ouvrir le modal
  openModal(): void {
    this.isModalVisible = true;
  }

  // Fermer le modal
  closeModal(): void {
    this.isModalVisible = false;
  }
}
