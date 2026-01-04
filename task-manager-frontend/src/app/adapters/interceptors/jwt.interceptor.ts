import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthState } from '../../application/auth/auth.state';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthState);
  const token = authState.token();

  if (req.url.includes('/auth/login')) {
    return next(req);
  }

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'x-api-version': '1.0',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  );
};
