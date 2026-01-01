import { Routes } from '@angular/router';
import { TaskList } from './ui/tasks/task-list/task-list';

export const routes: Routes = [
  //   { path: 'login', component: LoginComponent },
  //   { path: 'register', component: RegisterComponent },
  { path: 'tasks', component: TaskList },
  //   { path: '', redirectTo: '/tasks', pathMatch: 'full' },
];
