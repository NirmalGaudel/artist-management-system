import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { ToastService } from "../services/toast.service";

export function httpInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const toastService = inject(ToastService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('HTTP Error:', error);
    
          let errorMessage = 'An unexpected error occurred';
    
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 0) {
            errorMessage = 'Network error. Please check your connection.';
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized! Please log in again.';
          } else if (error.status === 403) {
            errorMessage = 'Access denied!';
          } else if (error.status === 500) {
            errorMessage = 'Server error! Please try again later.';
          }
    
          toastService.error(errorMessage);
          return throwError(() => error);
        })
      );;
  }