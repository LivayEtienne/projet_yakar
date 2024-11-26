import { Component, OnInit } from '@angular/core';
import { MessageService, Message } from '../post/message.service';
import { CommonModule } from '@angular/common';  // Import de CommonModule

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css'], // Assurez-vous que c'est un composant standalone
    imports: [CommonModule], // Ajout de CommonModule dans imports
    standalone: true
})
export class ModalComponent implements OnInit {
  message: Message | null = null;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.message$.subscribe((message) => {
      this.message = message;
    });
  }

  closeModal() {
    this.messageService.clearMessage();
  }
}
