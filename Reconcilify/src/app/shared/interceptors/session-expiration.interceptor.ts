import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class SessionExpirationInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });

    return next.handle(req).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          if (
            err.status === 404 &&
            err.url &&
            err.url.includes('/login') &&
            !['', '#/login'].includes(location.hash)
          ) {
            this.authService.onLogout.emit();
            this.authService.setCurrentUser(null);
            this.router.navigate(['/login']);
          }
          return next.handle(req);
        },
      })
    );
  }
}
