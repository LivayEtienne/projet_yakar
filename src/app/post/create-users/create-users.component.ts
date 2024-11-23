import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common'; // Importer CommonModule pour *ngIf
import { ReactiveFormsModule } from '@angular/forms'; // Importer ReactiveFormsModule pour les formulaires
import { MessageService } from '../message.service'; 
import { Location } from '@angular/common'


@Component({
    selector: 'app-create-user',
    templateUrl: './create-users.component.html',
    styleUrls: ['./create-users.component.css'],
    imports: [CommonModule, ReactiveFormsModule],
    standalone: true,
})
export class CreateUserComponent {

  userForm: FormGroup;
  currentStep: number = 1; // Variable pour suivre l'étape actuelle
  passwordErrorMessage: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService,   private messageService: MessageService ,private location: Location, private router: Router) {
    this.userForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      telephone: [null, [Validators.required, Validators.pattern(/^\d{8,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required, Validators.minLength(8)],
      code: ['null', Validators.required],
      role: ['user', Validators.required],
    });
  }

  // Passer à l'étape suivante
  nextStep() {
    if (this.currentStep === 1 && this.userForm.get('prenom')?.valid && this.userForm.get('nom')?.valid) {
      this.currentStep++;
    } else if (this.currentStep === 2 && this.userForm.get('telephone')?.valid && this.userForm.get('email')?.valid) {
      this.currentStep++;
    } else if (this.currentStep === 3 && this.userForm.get('password')?.valid && this.userForm.get('code')?.valid) {
      this.onSubmit(); // Soumettre le formulaire à l'étape finale
    }
  }

  // Revenir à l'étape précédente
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }


  

  // Soumettre le formulaire
  onSubmit() {
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value).subscribe({
        next: () => {
          this.messageService.showMessage({
            type: 'success',
            text: 'Utilisateur ajouter avec succès !',
          });
          this.router.navigate(['/list-users']);
        },
        error: (err) => {
          console.error('Erreur lors de la création :', err);
          alert('Erreur lors de la création de l\'utilisateur.');
        },
      });
    }
  }

  goBack(): void {
    this.location.back();  // Utilise le service Location pour revenir à la page précédente
  }
  
  /*validatePasswordRealTime() {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])(.{8})$/;
    const password = this.userForm.get('password')?.value;
    if (!passwordRegex.test(password)) {
      this.passwordErrorMessage = 'Le mot de passe doit contenir au moins une lettre majuscule, un chiffre et un caractère spécial.';
    } else {
      this.passwordErrorMessage = '';
    }
  }*/
}
