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

  isSidebarOpen = false;
  isDarkMode = false;

  // Méthode pour toggler la sidebar
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Méthode pour basculer entre le mode nuit et jour
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');  // Appliquer la classe dark-mode au body
    } else {
      document.body.classList.remove('dark-mode');  // Retirer la classe dark-mode
    }
  }

  
}
