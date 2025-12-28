import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('accessToken');

  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 && token) {
        // Try to refresh token
        return authService.refreshToken().pipe(
          switchMap((response: any) => {
            localStorage.setItem('accessToken', response.accessToken);
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`
              }
            });
            return next(clonedReq);
          }),
          catchError(refreshError => {
            authService.logout().subscribe();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

