import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly LIGHT_THEME = 'light';
  private readonly DARK_THEME = 'dark';

  constructor() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      this.setDarkMode(savedTheme === this.DARK_THEME);
    } else {
      this.setDarkMode(false); // Par défaut, utiliser le thème clair
    }
  }

  // Vérifie si le thème est sombre
  isDarkMode(): boolean {
    return document.documentElement.getAttribute('data-theme') === this.DARK_THEME;
  }

  // Change le mode du thème et le sauvegarde
  setDarkMode(isDark: boolean): void {
    const theme = isDark ? this.DARK_THEME : this.LIGHT_THEME;
    document.documentElement.setAttribute('data-theme', theme); // Appliquer le thème au document
    localStorage.setItem('theme', theme); // Sauvegarder dans localStorage
  }
}
