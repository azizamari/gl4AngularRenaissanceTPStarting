import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { API } from '../../../config/api.config';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.token();
  // Never send our token to third party APIs
  if (!token || !request.url.startsWith(API.base)) {
    return next(request);
  }
  return next(request.clone({ setHeaders: { Authorization: token } })).pipe(
    catchError((error: HttpErrorResponse) => {
      // The server no longer accepts the token (expired or revoked)
      if (error.status === HttpStatusCode.Unauthorized) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
