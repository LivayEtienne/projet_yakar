import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor( private router: Router) {}
  redirectToListUsers() {
    this.router.navigate(['/list-users']);
  }
  redirectToHistoric() {
    this.router.navigate(['/historiques']);
  }
  redirectToDashboardAdmin() {
    this.router.navigate(['/dashboard/admin']);
  }
}
