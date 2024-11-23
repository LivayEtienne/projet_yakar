import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

export interface Message {
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

export interface Confirmation {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messageSubject = new BehaviorSubject<Message | null>(null);
  message$ = this.messageSubject.asObservable();

  private confirmSubject = new Subject<boolean>();
  confirm$ = this.confirmSubject.asObservable();

  showMessage(message: Message) {
    this.messageSubject.next(message);
  }

  clearMessage() {
    this.messageSubject.next(null);
  }

  confirm(config: Confirmation): Observable<boolean> {
    // Vous pouvez ici manipuler un flux d'Observable pour afficher un message dans la modale
    this.showMessage({
      type: 'info',
      text: config.message,
    });
    return this.confirm$; // Vous renvoyez l'Observable pour que l'UI puisse y souscrire
  }

  respondToConfirm(response: boolean) {
    this.confirmSubject.next(response); // Répondre à la confirmation
    this.confirmSubject.complete(); // Compléter l'Observable
  }
}
