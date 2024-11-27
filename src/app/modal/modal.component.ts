import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageService } from '../post/message.service'; // Service pour les messages
import { CommonModule } from '@angular/common';  // Import de CommonModule

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ModalComponent implements OnInit {
  message: any = null;  // Message contenant l'info du modal
  confirmationResponse: boolean | null = null; // Pour la réponse de confirmation

  @Output() confirmAction = new EventEmitter<boolean>(); // Émettre une réponse (true/false)

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    // Observer les messages de type 'confirm' envoyés par le MessageService
    this.messageService.message$.subscribe((message) => {
      this.message = message;
    });
  }

  // Méthode pour fermer le modal
  // closeModal(): void {
  //   this.messageService.clearMessage();  // Supprimer le message
  //   this.confirmationResponse = null; // Réinitialiser la réponse
  // }

  // Méthode pour gérer la confirmation (quand l'utilisateur confirme ou annule)
  // onConfirm(response: boolean): void {
  //   this.confirmAction.emit(response);  // Émettre la réponse (true ou false)
  //   this.closeModal();  // Fermer le modal après la confirmation
  // }

  // Méthode pour gérer la confirmation (quand l'utilisateur confirme ou annule)
  onConfirm(response: boolean): void {
    this.messageService.emitConfirmationResponse(response);  // Émettre la réponse de l'utilisateur
    this.closeModal();  // Fermer le modal après la confirmation
  }

  closeModal(): void {
    this.messageService.clearMessage();  // Réinitialiser le message après la fermeture
  }
}
