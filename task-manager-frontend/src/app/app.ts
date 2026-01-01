import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from "./ui/home/nav/nav";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('task-manager-frontend');
}

/**
 * -ui
 * 
 *  -home
 *   -nav
 *   -router-outlet
 * 
 *  -auth
 *   -login
 *   -register
 * 
 * 
 * 
 */