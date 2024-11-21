import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private subject = new Subject<any>();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Vérifiez si nous sommes dans un navigateur
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  connect(url: string): void {
    // N'établissez une connexion WebSocket que si vous êtes dans un navigateur
    if (!this.isBrowser) {
      console.error('WebSocket n\'est pas disponible dans cet environnement (non-navigateur).');
      return;
    }

    // Initialisez la connexion WebSocket
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.subject.next(data); // Diffuser les données reçues
    };

    this.socket.onerror = (error) => {
      console.error('Erreur WebSocket :', error);
    };

    this.socket.onclose = () => {
      console.log('Connexion WebSocket fermée.');
    };
  }

  // Observable pour écouter les données
  getData(): Observable<any> {
    return this.subject.asObservable();
  }

  // Déconnecter proprement
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = null;
  }
}

