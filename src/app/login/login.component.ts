import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component';
import { CodeService } from '../code.service';


@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ThemeToggleComponent, 
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
  private socketSubscription: Subscription | undefined;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private codeService: CodeService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Validation email
      password: ['', [Validators.required, Validators.minLength(8)]] // Validation mot de passe
    });
  }

  ngOnInit(): void {
   
    // Écoute des données reçues
    this.socketSubscription = this.codeService.getMessages().subscribe((message) => {
      if (message.type === 'keypad') {
        const char = message.value;
        //console.log(message.value);
        this.showModal = true;
        this.addCharacterToCode(char);
      }
    });
  }

   /**
   * Ajouter un caractère au tableau du code.
   * @param char Caractère reçu
   */
   addCharacterToCode(char: string): void {
    console.log(char);
    // Si le caractère est 'A', on supprime le dernier caractère ajouté
    if (char === 'A') {
      if (this.currentIndex > 0) {
        // Revenir à l'index précédent (annuler la dernière entrée)
        this.currentIndex--;
        this.code[this.currentIndex] = ''; // Supprimer la valeur de l'index précédent
        this.maskedCode[this.currentIndex] = ''; // Supprimer le masque du champ
      }
      return; // Arrêter la fonction après la suppression
    }
    
    // Si le caractère est 'B', 'C', 'D', '*' ou '#', on ne fait rien
    if (['B', 'C', 'D', '*', '#'].includes(char)) {
      return; // Ne rien faire, ignorer ces caractères
    }
  
    // Enlève les caractères de contrôle (tels que \r et \n)
    const cleanedChar = char.replace(/\r|\n/g, '');
  
    if (this.currentIndex < 4) {
      console.log("before: ", this.code);
  
      // Ajout du caractère reçu (après nettoyage)
      this.code[this.currentIndex] = cleanedChar; // Stocke la vraie valeur
      this.maskedCode[this.currentIndex] = cleanedChar; // Affiche temporairement le caractère
  
      const currentIndex = this.currentIndex; // Capture l'index actuel pour setTimeout
  
      // Masquer le caractère après 2 secondes
      setTimeout(() => {
        if (this.code[currentIndex] === cleanedChar) {
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
      } else if (index === 4 ) {
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
    console.log(this.code)
    const codeValue = this.code.join('').replace(/\r|\n/g, ''); // Concaténer les 4 caractères pour former le code
    console.log(codeValue.length)
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
            // Affiche le message d'erreur venant du backend
            this.errorMessage = err;
            //console.error('Erreur de connexion:', err);
          }
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

  ngOnDestroy(): void {
    // Se désabonner lors de la destruction du composant
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    this.codeService.closeConnection();
  }
}
