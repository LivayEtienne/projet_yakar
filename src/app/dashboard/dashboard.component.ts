import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { TemperatureCardComponent } from '../temperature-card/temperature-card.component';
import { HumidityCardComponent } from '../humidity-card/humidity-card.component';
import { AverageCardComponent } from '../average-card/average-card.component';
import { ViewGraphComponent } from '../view-graph/view-graph.component';
import { Moyenne1Component } from "../moyenne1/moyenne1.component";
import { Moyenne2Component } from '../moyenne2/moyenne2.component';
import { Moyenne3Component } from '../moyenne3/moyenne3.component';
import { FooterComponent } from '../footer/footer.component';
import { FormulaireComponent } from '../formulaire/formulaire.component';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    TemperatureCardComponent,
    HumidityCardComponent,
    AverageCardComponent,
    HeaderComponent,
    ViewGraphComponent,
    Moyenne1Component,
    Moyenne2Component,
    Moyenne3Component,
    FooterComponent,
    FormulaireComponent
],
   templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  errorMessage: any;
  
  constructor() { }

}



