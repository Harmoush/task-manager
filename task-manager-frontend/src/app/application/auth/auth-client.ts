import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../../domain/dtos/register-request';

export interface AuthClient {
  login(username: string, password: string): Observable<string>;
  register(request: RegisterRequest): Observable<void>;
  logout(): void;
  getToken(): string | null;
}

export const AUTH_CLIENT = new InjectionToken<AuthClient>('AUTH_CLIENT');
