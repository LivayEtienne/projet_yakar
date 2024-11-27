import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class CodeService {
  private socket$: any;
  private socketUrl: string = 'ws://localhost:8000'; // URL du serveur WebSocket (Node.js)



  
  constructor() {
    // Initialiser la connexion WebSocket
    this.socket$ = webSocket(this.socketUrl);
  }

  // Méthode pour écouter les messages du serveur WebSocket
  getMessages(): Observable<any> {
    return this.socket$;
  }


  // Méthode pour fermer la connexion WebSocket
  closeConnection(): void {
    this.socket$.complete();
  }
}


