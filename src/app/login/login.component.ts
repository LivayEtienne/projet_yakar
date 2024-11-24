import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { WebSocketService } from '../web-socket.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
 
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  code: string[] = ['', '', '', '']; // Code réel
  maskedCode: string[] = ['', '', '', '']; // Masque des champs (points noirs)
  currentIndex = 0; // Index actif
  showModal = false;
  loginForm: FormGroup;
  errorMessage: string | null = null;
  errorMessageCode: string | null = null;
  codeForm: any;
  incorrectAttempts = 0; // Compteur de tentatives incorrectes
  maxAttempts = 3; // Limite des tentatives

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private webSocketService: WebSocketService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    // Connexion au WebSocket
    this.webSocketService.connect('ws://localhost:4000/');

    // Écoute des données reçues
    this.webSocketService.getData().subscribe({
      next: (data) => {
        const char = data.keypadCode;
        this.showModal = true;
        this.addCharacterToCode(char);
      },
      error: (err) => console.error('Erreur WebSocket :', err),
    });
  }

   /**
   * Ajouter un caractère au tableau du code.
   * @param char Caractère reçu
   */
   addCharacterToCode(char: string): void {
    if (this.currentIndex < 4) {
      // Ajout du caractère reçu
      this.code[this.currentIndex] = char; // Stocke la vraie valeur
      this.maskedCode[this.currentIndex] = char; // Affiche temporairement le caractère
  
      const currentIndex = this.currentIndex; // Capture l'index actuel pour setTimeout
  
      // Masquer le caractère après 2 secondes
      setTimeout(() => {
        if (this.code[currentIndex] === char) {
          this.maskedCode[currentIndex] = '•'; // Remplace par un point noir
        }
      }, 500);
  
      this.currentIndex++; // Passe au champ suivant
  
      // Valider automatiquement lorsque tous les champs sont remplis
      if (this.currentIndex === 4) {
        this.validateCode();
      }
    }
  }
  

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

  /**
   * Gestion de l'entrée utilisateur pour les champs masqués.
   */
  onInput(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    const char = inputElement.value;

    // Met à jour la vraie valeur et masque
    if (char.length === 1) {
      this.code[index] = char; // Stocke la vraie valeur
      this.maskedCode[index] = '•'; // Affiche le masque

      // Passe au champ suivant
      const nextInput = document.querySelectorAll<HTMLInputElement>('.code-input input')[index + 1];
      if (nextInput) {
        nextInput.focus();
      } else if (index === 3) {
        // Valider si tous les champs sont remplis
        this.validateCode();
      }
    }
  }

  /**
   * Gestion de la suppression (Backspace).
   */
  handleKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && this.code[index] === '') {
      const prevInput = document.querySelectorAll<HTMLInputElement>('.code-input input')[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    } else if (event.key === 'Backspace') {
      this.code[index] = ''; // Supprime la valeur réelle
      this.maskedCode[index] = ''; // Supprime le masque
    }
  }

  validateCode(): void {
    const codeValue = this.code.join(''); // Concaténer les 4 caractères pour former le code

    if (codeValue.length === 4) {
      // Soumettre le code au backend
      this.authService.loginWithCode(codeValue).subscribe({
        next: (res: any) => {
          this.authService.saveToken(res.token); // Stocke le token
          this.handleRedirection(res.role); // Redirection après connexion réussie
          this.showModal = false; // Fermer le modal
          this.incorrectAttempts = 0; // Réinitialiser le compteur
        },
        error: (err) => {
          this.errorMessageCode = err.error?.msg || 'Code invalide.';
          console.log(this.errorMessageCode);
          this.incorrectAttempts++; // Incrémenter le compteur
          this.resetCode(); // Réinitialiser le code en cas d'erreur

          if (this.incorrectAttempts >= this.maxAttempts) {
            this.forceEmailLogin(); // Forcer la connexion via email/mot de passe
          }
        },
      });
    } else {
      this.errorMessageCode = 'Le code doit contenir exactement 4 chiffres.';
      this.resetCode();
    }
  }

    /**
   * Forcer la connexion par email/mot de passe.
   */
    forceEmailLogin(): void {
      this.showModal = false; // Désactiver le modal
      this.errorMessage = 'Trop de tentatives incorrectes. Veuillez vous connecter avec votre email et mot de passe.';
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
            this.authService.saveToken(res.token); // Stocke le token
            this.handleRedirection(res.role); // Redirection après connexion réussie
          },
          error: (err) => {
            this.errorMessage = err.error?.msg || 'Une erreur inconnue est survenue.';
          },
        });
    }
  }

  /**
   * Réinitialise les champs.
   */
  resetCode(): void {
    this.code = ['', '', '', ''];
    this.maskedCode = ['', '', '', ''];
    this.currentIndex = 0;
  }

  /**
   * Ferme le modal.
   */
  closeModal(): void {
    this.showModal = false;
    this.errorMessageCode = null;
    this.resetCode();
  }

/**
   * Afficher le modal pour le code secret.
   */
showSecretModal(): void {
  this.showModal = true;
}

/**
   * Obtenir les contrôles du formulaire de login.
   */
get showEmail() {
  return this.loginForm.get('email');
}

get showPassword() {
  return this.loginForm.get('password');
}
  handleRedirection(role: string): void {
    if (role === 'admin') {
      this.router.navigate(['/dashboard/admin']);
    } else if (role === 'user') {
      this.router.navigate(['/dashboard/user']);
    } else {
      this.errorMessage = 'Rôle inconnu. Veuillez contacter un administrateur.';
    }
  }
}
