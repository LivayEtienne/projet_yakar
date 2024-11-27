import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  /*private sensorSocket$: WebSocketSubject<any> | null = null;
  private keypadSocket$: WebSocketSubject<any> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Connect to WebSocket for sensor data
      this.sensorSocket$ = webSocket('ws://localhost:4000/sensor');

      // Connect to WebSocket for keypad data
      this.keypadSocket$ = webSocket('ws://localhost:4000/keypad');
    } else {
      console.warn('WebSockets not initialized: Running in a non-browser environment');
    }
  }

  // Listen to sensor data
  listenToSensorData(): Observable<any> {
    return this.sensorSocket$ ? this.sensorSocket$.asObservable() : of(null);
  }

  // Listen to keypad data
  listenToKeypadData(): Observable<any> {
    return this.keypadSocket$ ? this.keypadSocket$.asObservable() : of(null);
  }

  // Send commands to control ventilation
  controlVentilation(state: boolean): void {
    if (this.sensorSocket$) {
      const command = state ? 'VENT:ON' : 'VENT:OFF';
      this.sensorSocket$.next({ command });
    } else {
      console.warn('Cannot send command: WebSocket connection is not available');
    }
  }

  // Close WebSocket connections
  closeConnections(): void {
    this.sensorSocket$?.complete();
    this.keypadSocket$?.complete();
  }*/

    private socket$: any;
  private socketUrl: string = 'ws://localhost:8080'; // URL du serveur WebSocket (Node.js)

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
