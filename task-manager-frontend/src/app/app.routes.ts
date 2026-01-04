import { Routes } from '@angular/router';
import { TaskList } from './ui/tasks/task-list/task-list';
import { authGuard } from './ui/auth/auth.guard';
import { Login } from './ui/auth/login/login';
import { Home } from './ui/home/home';
import { Register } from './ui/auth/register/register';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'tasks', component: TaskList, canActivate: [authGuard] },
  // { path: '', redirectTo: '/tasks', pathMatch: 'full' },
];
