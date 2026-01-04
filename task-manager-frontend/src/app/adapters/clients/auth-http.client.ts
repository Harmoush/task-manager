import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthClient } from '../../application/auth/auth-client';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RegisterRequest } from '../../domain/dtos/register-request';

//To-Do Apply Hexagonal Architecture - Create AuthHttpClient as an adapter for AuthService
@Injectable({
  providedIn: 'root',
})
export class AuthHttpClient implements AuthClient {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}
  logout(): void {
    // No Need, handled in state + storage
  }

  getToken(): string | null {
    return null;
  }

  login(email: string, password: string): Observable<string> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, {
        email,
        password,
      })
      .pipe(map((r) => r.token));
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request);
  }
}
