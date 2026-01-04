import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './ui/home/nav/nav';
import { AuthService } from './application/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('task-manager-frontend');
  constructor(private authService: AuthService) {
    authService.restore();
  }
}
