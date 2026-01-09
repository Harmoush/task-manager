import { inject, Injectable } from '@angular/core';
import { AUTH_CLIENT } from './auth-client';
import { AuthState } from './auth.state';
import { tap } from 'rxjs';
import { JwtAdapter } from '../../adapters/storage/jwt.adapter';
import { RegisterRequest } from '../../domain/dtos/register-request';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authState = inject(AuthState);
  private readonly authClient = inject(AUTH_CLIENT);
  private readonly jwtAdapter = inject(JwtAdapter);

  login(username: string, password: string) {
    return this.authClient.login(username, password).pipe(
      tap((token) => {
        this.authState.setToken(token);
        this.jwtAdapter.save(token);
      })
    );
  }

  logout() {
    this.authClient.logout();
    this.authState.clear();
    this.jwtAdapter.clear();
  }

  isAuthenticated() {
    return this.authState.isAuthenticated();
  }

  restore() {
    const token = this.jwtAdapter.get();
    if (token) {
      this.authState.setToken(token);
    }
  }

  register(data: RegisterRequest) {
    return this.authClient.register(data);
  }

  getToken() {
    return this.authState.token();
  }
}
