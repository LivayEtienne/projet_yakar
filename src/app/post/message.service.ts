import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Message {
  type: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messageSource = new BehaviorSubject<Message | null>(null);
  message$ = this.messageSource.asObservable(); // Observable pour écouter les messages

  private confirmationResponseSource = new BehaviorSubject<boolean | null>(null);
  confirmationResponse$ = this.confirmationResponseSource.asObservable(); // Observable pour écouter les réponses de confirmation

  // Afficher un message
  showMessage(message: Message): void {
    this.messageSource.next(message);
  }

  // Effacer un message
  clearMessage(): void {
    this.messageSource.next(null);
    // this.confirmationResponseSource.next(null);
  }

  // Envoyer la réponse de confirmation
  emitConfirmationResponse(response: boolean | null ): void {
    this.confirmationResponseSource.next(response);
  }
}
