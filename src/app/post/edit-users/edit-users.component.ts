import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../users';
import { MessageService } from '../message.service'; // Importation du service pour afficher les messages


@Component({
    selector: 'app-user-edit',
    imports: [CommonModule, FormsModule, RouterModule],
    standalone: true,
    templateUrl: './edit-users.component.html',
    styleUrls: ['./edit-users.component.css']
})
export class UserEditComponent implements OnInit {
  userId!: string;
  user: User = {
    _id: '',
    prenom: '',
    nom: '',
    telephone: 0,
    email: '',
    code: 0,
    password: '',
    archive: false,
    role: 'user',
  };

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService // Injection du service de messages
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.getUser();
  }

  getUser(): void {
    this.userService.getUserById(this.userId).subscribe((data) => {
      this.user = data;
    });
  }

  // Méthode de mise à jour de l'utilisateur
  updateUser(): void {
    this.userService.updateUser(this.userId, this.user).subscribe(() => {
      // Affichage du message de succès via le service de message
      this.messageService.showMessage({
        type: 'success',
        text: 'Utilisateur mis à jour avec succès !',
      });
      // Redirection vers la liste des utilisateurs
      this.router.navigate(['/list-users']);
    });
  }
}
