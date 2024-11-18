import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {

  email = '';
  password = '';
  code: string[] = ['', '', '', ''];
  showSecretModal = false;

 
  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => this.authService.handleLoginResponse(res),
      error: (err) => console.error('Login failed', err),
    });
  }

  loginWithCode() {
    const codeString = this.code.join('');
    this.authService.loginWithCode(this.email, codeString).subscribe({
      next: (res) => this.authService.handleLoginResponse(res),
      error: (err) => console.error('Login with code failed', err),
    });
  }


  ngOnInit() {
    this.logout();
  }
  
    /**
     * Déplace le focus vers le prochain champ d'entrée lorsque l'utilisateur tape un chiffre.
     * @param event Événement d'entrée.
     * @param nextIndex Index du prochain champ.
     */
    focusNext(event: Event, nextIndex: number): void {
      const inputElement = event.target as HTMLInputElement;
  
      if (inputElement.value && nextIndex < this.code.length) {
        // Récupérer le prochain élément d'entrée
        const nextInput = document.querySelectorAll<HTMLInputElement>('.code-input input')[nextIndex];
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  
    /**
     * Valider le code saisi et effectuer une action (exemple : authentification).
     */
    onSubmit(): void {
      const enteredCode = this.code.join('');
      if (enteredCode.length === 4) {
        console.log('Code validé :', enteredCode);
        // Ajouter ici la logique de validation du code
      } else {
        console.error('Veuillez saisir un code complet.');
      }
    }

  
    /**
     * Réinitialiser le code et fermer la modal.
     */
    onCancel(): void {
      this.code = ['', '', '', ''];
      this.showSecretModal = false;
    }



    logout() {
      this.authService.logout();
    }


}
