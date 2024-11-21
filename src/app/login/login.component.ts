import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WebSocketService } from '../web-socket.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
   
    // ...
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})


export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  code: string[] = ['', '', '', '']; // Code reçu par le WebSocket
  currentIndex = 0; // Index pour insérer le prochain caractère
  showModal = false; // Contrôle du modal pour le code secret
  loginForm: FormGroup; // Formulaire pour l'email et le mot de passe
  errorMessage: string | null = null; // Message d'erreur pour le login classique
  errorMessageCode: string | null = null; // Message d'erreur pour le code secret

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private webSocketService: WebSocketService
  ) {
    // Initialisation des formulaires
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
   
  }

  ngOnInit(): void {
    // Connexion au WebSocket
    this.webSocketService.connect('ws://localhost:8080/');

    // Écoute des données reçues
    this.webSocketService.getData().subscribe({
      next: (data) => {
        const char = data.keypadCode; // Récupérer le caractère
        this.showModal = true; // Afficher le modal si un code est reçu
        this.addCharacterToCode(char); // Ajouter le caractère au tableau
      },
      error: (err) => {
        console.error('Erreur WebSocket :', err);
      },
    });
  }

  ngOnDestroy(): void {
    // Déconnexion propre du WebSocket lors de la destruction du composant
    this.webSocketService.disconnect();
  }

  /**
   * Ajouter un caractère au tableau du code.
   * @param char Caractère reçu
   */
  addCharacterToCode(char: string): void {
    if (this.currentIndex < 4) {
      this.code[this.currentIndex] = char; // Ajouter le caractère à l'index actuel
      this.currentIndex++; // Passer au champ suivant

      // Valider automatiquement lorsque le tableau est rempli
      if (this.currentIndex === 4) {
        this.validateCode();
      }
    }
  }

  /**
   * Valider le code complet.
   */
  validateCode(): void {
    const codeValue = this.code.join(''); // Concaténer les 4 caractères pour former le code

    if (codeValue.length === 4) {
      // Soumettre le code au backend
      this.authService.loginWithCode(codeValue).subscribe({
        next: (res: any) => {
          this.handleRedirection(res.role); // Redirection après connexion réussie
          this.showModal = false; // Fermer le modal
        },
        error: (err) => {
          this.errorMessageCode = err.error?.msg || 'Code invalide.';
          console.log(this.errorMessageCode);
          this.resetCode(); // Réinitialiser le code en cas d'erreur
        },
      });
    } else {
      this.errorMessageCode = 'Le code doit contenir exactement 4 chiffres.';
      this.resetCode();
    }
  }

  /**
   * Réinitialiser le code.
   */
  resetCode(): void {
    this.code = ['', '', '', ''];
    this.currentIndex = 0;
  }

  /**
   * Connexion classique via email/mot de passe.
   */
  login(): void {
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (res: any) => {
            this.handleRedirection(res.role); // Redirection après connexion réussie
          },
          error: (err) => {
            this.errorMessage = err.error?.msg || 'Une erreur inconnue est survenue.';
          },
        });
    }
  }

  /**
   * Rediriger l'utilisateur après la connexion en fonction de son rôle.
   * @param role Rôle de l'utilisateur
   */
  handleRedirection(role: string): void {
    if (role === 'admin') {
      this.router.navigate(['/dashboard/admin']);
    } else if (role === 'user') {
      this.router.navigate(['/dashboard/user']);
    } else {
      this.errorMessage = 'Rôle inconnu. Veuillez contacter un administrateur.';
    }
  }

  /**
   * Afficher le modal pour le code secret.
   */
  showSecretModal(): void {
    this.showModal = true;
  }

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
  get showEmail() {
    return this.loginForm.get('email');
  }

  get showPassword() {
    return this.loginForm.get('password');
  }

  closeModal() {
    this.showModal = false;
    this.errorMessage = null; // Réinitialiser le message d'erreur
    this.resetCode(); // Réinitialiser le code en cas de fermeture du modal
  }
}
