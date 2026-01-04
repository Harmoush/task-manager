import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthState } from '../../../application/auth/auth.state';
import { AuthService } from '../../../application/auth/auth.service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink],
  templateUrl: './nav.html',
})
export class Nav {
  readonly isAuthenticated = inject(AuthState).isAuthenticated;

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
