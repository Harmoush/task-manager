import { Routes } from '@angular/router';
import { TaskList } from './ui/tasks/task-list/task-list';
import { authGuard } from './ui/auth/auth.guard';
import { Login } from './ui/auth/login/login';
import { Home } from './ui/home/home';
import { Register } from './ui/auth/register/register';
import { TaskCreate } from './ui/tasks/task-create/task-create';
import { TaskEdit } from './ui/tasks/task-edit/task-edit';
import { KanbanPage } from './ui/kanban/kanban-page/kanban-page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'tasks', component: TaskList, canActivate: [authGuard] },
  { path: 'tasks/new', component: TaskCreate, canActivate: [authGuard] },
  { path: 'tasks/edit/:id', canActivate: [authGuard], loadComponent: () => TaskEdit },
  { path: 'kanban', canActivate: [authGuard], loadComponent: () => KanbanPage },
];
