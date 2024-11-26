import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone:true,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  imageUrl : string = '/assets/Yaakaar.png';


  constructor(private authService: AuthService){}
  logout(){
    this.authService.logout();
  }
}
