import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './adapters/interceptors/jwt.interceptor';
import { TaskHttpClient } from './adapters/clients/task-http.client';
import { TASK_CLIENT } from './application/tasks/task-client';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: TASK_CLIENT, useClass: TaskHttpClient },
  ],
};
