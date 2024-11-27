import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Importation de FormsModule
import { User } from '../users';
import { ModalComponent } from '../../modal/modal.component';
import { MessageService } from '../message.service';


@Component({
  selector: 'app-list-users',
  standalone: true, // Indique que ce composant est autonome
  imports: [CommonModule, RouterModule, FormsModule,ModalComponent], // Ajout de FormsModule ici
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css'],
})

export class ListUsersComponent {
  users: User[] = []; // Liste des utilisateurs
  isLoading = true; // Indicateur de chargement
  errorMessage: string | null = null; // Message d'erreur
  searchQuery: string = ''; // Texte de recherche

  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private userService: UserService ,private messageService: MessageService, private router: Router ) {}

  ngOnInit(): void {
    // Charger la liste des utilisateurs
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des utilisateurs.';
        this.isLoading = false;
        console.error('Erreur :', error);
      }
    );
  }

  // Filtrer les utilisateurs selon la recherche
  get filteredUsers(): User[] {
    if (!this.searchQuery) {
      return this.users; // Si la recherche est vide, retourner tous les utilisateurs
    }
    const lowerCaseQuery = this.searchQuery.toLowerCase(); // Recherche insensible à la casse
    return this.users.filter(user =>
      user.nom.toLowerCase().includes(lowerCaseQuery) ||
      user.prenom.toLowerCase().includes(lowerCaseQuery) ||
      user.email.toLowerCase().includes(lowerCaseQuery)
    );
  }

  // Pagination des utilisateurs filtrés
  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

//Afficher le modal pour confirmer la suppression
deleteUser(id: string): void {
  this.messageService.showMessage({
    type: 'confirm',
    text: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
  });
// Attendre la confirmation via un modal
this.messageService.confirmationResponse$.subscribe((response: boolean | null) => {
  if (response) {
    this.executeDelete(id);
  }
});
}//Fonction exécutée si l'utilisateur confirme la suppression
private executeDelete(id: string): void {
  this.userService.deleteUser(id).subscribe(
    () => {
      this.users = this.users.filter(user => user._id !== id);
      this.messageService.showMessage({
        type: 'success',
        text: 'Utilisateur supprimé avec succès',
      });
      setTimeout(() => {
        window.location.reload(); // Actualiser la page après 2 secondes
      }, 3000);
    },
    (error) => {
      console.error(`Erreur lors de la suppression de l'utilisateur avec ID ${id} :`, error);
    }
  );
}

  



  changeRole(user: User): void {
    const newRole = user.role === 'admin' ? 'user' : 'admin'; // Changer entre admin et user
    this.userService.changeRole(user._id, newRole).subscribe(
      (updatedUser) => {
        user.role = updatedUser.role; // Mettre à jour le rôle dans la liste
        this.messageService.showMessage({
          type: 'success',
          text: 'Role changer  avec succès !',
        });
        setTimeout(() => {
          window.location.reload(); // Actualiser la page après 2 secondes
        }, 3000);
      },
      (error) => {
        console.error('Erreur lors du changement de rôle:', error);
      }
    );
  }


  // Changer l'état d'accès (activer ou archiver un utilisateur)
  toggleAccess(user: User): void {
    const newArchiveState = !user.archive;
    this.userService.archiveUser(user._id).subscribe(
      () => {
        user.archive = newArchiveState; // Mise à jour de l'état d'archive de l'utilisateur
        this.messageService.showMessage({
          type: 'success',
          text: 'Acces Modifier  avec succès !',
        });
         // Actualiser la page après 2 secondes
        
      },
      (error) => {
        console.error('Erreur lors de la modification de l\'accès:', error);
      }
    );
  }

  redirectToListUsers() {
    this.router.navigate(['/list-users']);
  }
  redirectToHistoric() {
    this.router.navigate(['/historiques']);
  }
  redirectToDashboardAdmin() {
    this.router.navigate(['/dashboard/admin']);
  }



  
}
