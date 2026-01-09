import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtInterceptor } from './adapters/interceptors/jwt.interceptor';
import { APP_PROVIDERS } from './app.providers';
import { provideStore } from '@ngrx/store';
import { taskReducer } from './application/store/reducer/task.reducer';
import { provideEffects } from '@ngrx/effects';
import { TaskEffects } from './application/store/effects/task.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([JwtInterceptor])),
    provideStore({
      tasks: taskReducer,
    }),
    provideEffects([TaskEffects]),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    ...APP_PROVIDERS,
  ],
};
