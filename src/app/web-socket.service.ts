import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {

  private socket$: any;
  private socketUrl: string = 'ws://localhost:8080'; // URL du serveur WebSocket (Node.js
  
  constructor() {
    // Initialiser la connexion WebSocket
    this.socket$ = webSocket(this.socketUrl);
  }

  // Méthode pour écouter les messages du serveur WebSocket
  getMessages(): Observable<any> {
    return this.socket$;
  }

  // Méthode pour envoyer des messages au serveur WebSocket
  sendMessage(message: any): void {
    this.socket$.next(message);
  }

  // Méthode pour fermer la connexion WebSocket
  closeConnection(): void {
    this.socket$.complete();
  }
}
