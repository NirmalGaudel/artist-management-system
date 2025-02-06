import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);

  login(credentials: { email: string; password: string }): Observable<any> {
    this.loadingService.show();
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(finalize(() => this.loadingService.hide()));
  }

  register(user: any): Observable<any> {
    this.loadingService.show();
    return this.http.post(`${this.apiUrl}/register`, user).pipe(finalize(() => this.loadingService.hide()));
  }

  logout() {
    localStorage.removeItem('token');
  }
}
