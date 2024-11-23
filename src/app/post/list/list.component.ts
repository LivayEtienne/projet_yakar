// src/app/post/list/list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonneesService } from '../donnes.service'; // Assurez-vous que le chemin est correct
import { RouterModule } from '@angular/router';  // Importer RouterModule pour navigation

@Component({
  selector: 'app-list',
  standalone: true,  // Marque ce composant comme autonome
  imports: [CommonModule, RouterModule],  // Importer les modules nécessaires
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  donnes: any[] = [];

  constructor(private donneesService: DonneesService) {}

  ngOnInit(): void {
    this.donneesService.getAllDonnes().subscribe(data => {
      this.donnes = data;
    });
  }

  deleteDonne(id: string): void {
    this.donneesService.deleteDonne(id).subscribe(() => {
      this.donnes = this.donnes.filter(donne => donne._id !== id);
    });
  }
  
}
