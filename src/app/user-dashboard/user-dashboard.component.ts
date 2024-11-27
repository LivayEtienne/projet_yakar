import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TemperatureCardComponent } from '../temperature-card/temperature-card.component';
import { AverageCardComponent } from '../average-card/average-card.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { HumidityCardComponent } from '../humidity-card/humidity-card.component';
import { Moyenne1Component } from '../moyenne1/moyenne1.component';
import { Moyenne2Component } from '../moyenne2/moyenne2.component';
import { Moyenne3Component } from '../moyenne3/moyenne3.component';
import { ViewGraphComponent } from '../view-graph/view-graph.component';

@Component({
  selector: 'app-user-dashboard',
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
    FooterComponent
],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {

}
