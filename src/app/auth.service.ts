import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  loginWithCode(email: string, code: string) {
    return this.http.post(`${this.apiUrl}/login/code`, { email, secretCode: code });
  }

  handleLoginResponse(response: any) {
    localStorage.setItem('token', response.token);
    if (response.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/user']);
    }
  }

  logout() {
    //localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  
}
