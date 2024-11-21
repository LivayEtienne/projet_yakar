import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password});
  }

  loginWithCode(code: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { code });
  }

  

  logout() {
    return this.http.post(`${this.apiUrl}/auth/logout`, null)
  }
 
}
