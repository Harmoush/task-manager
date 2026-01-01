import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//To-Do Apply Hexagonal Architecture - Create AuthHttpClient as an adapter for AuthService
@Injectable({
  providedIn: 'root',
})
export class AuthHttpClient {
  private apiUrl = 'https://localhost:5287/api/auth';

  constructor(private http: HttpClient) {}

  async login(email: string, password: string) {
    const response = await this.http.post(`${this.apiUrl}/login`, { email, password });
    return response;
  }

  async register(email: string, password: string) {
    const response = await this.http.post(`${this.apiUrl}/register`, { email, password });
    return response;
  }
}
