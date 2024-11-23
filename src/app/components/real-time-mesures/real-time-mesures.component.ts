import { Component } from '@angular/core';
import axios from 'axios'; // Importation d'Axios
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-real-time-mesures',
  standalone: true,
  imports: [CommonModule], // Ajout de CommonModule
  templateUrl: './real-time-mesures.component.html',
  styleUrls: ['./real-time-mesures.component.css'],
})
export class RealTimeMesuresComponent {
  mesures: any[] = [];
  private apiUrl = 'http://localhost:3000/api';

  constructor() {}

  ngOnInit(): void {
    this.loadMesures();
  }

  loadMesures(): void {
    axios
      .get(`${this.apiUrl}/mesures`)
      .then((response) => {
        this.mesures = response.data;
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des mesures:', error);
      });
  }
}
