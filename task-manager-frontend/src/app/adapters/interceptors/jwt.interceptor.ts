import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpClient } from '../clients/auth-http.client';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private auth: AuthHttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'x-api-version': '1.0',
        },
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
