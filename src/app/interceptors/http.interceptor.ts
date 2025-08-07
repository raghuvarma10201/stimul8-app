import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private authService : AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    // Clone the request and add the Authorization header with the token
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, // Use the token or an empty string if not found
      },
    });

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle unauthorized error (401)
          this.handleUnauthorized();
        }
        return throwError(() => error);
      })
    );
  }

  private handleUnauthorized() {
   this.authService.logout();
  }
}

export { HttpInterceptor };
