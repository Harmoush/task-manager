import { Provider } from '@angular/core';
import { TASK_CLIENT } from './application/tasks/task-client';
import { AUTH_CLIENT } from './application/auth/auth-client';
import { TaskHttpClient } from './adapters/clients/task-http.client';
import { AuthHttpClient } from './adapters/clients/auth-http.client';

export const APP_PROVIDERS: Provider[] = [
  { provide: TASK_CLIENT, useClass: TaskHttpClient },
  { provide: AUTH_CLIENT, useClass: AuthHttpClient },
];
