import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, firstValueFrom, Observable, tap } from 'rxjs';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../components/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { APP_CONFIG } from '../../environments/app-config.token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private user = JSON.parse(localStorage.getItem('user') || 'null');
  private token = localStorage.getItem('token') || null;
  private readonly appConfig = inject(APP_CONFIG);

  public readonly api_url = this.appConfig.api_url;

  login(credentials: { email: string; password: string }): Observable<any> {
    this.loadingService.show();
    return this.http.post(`${this.api_url}/auth/login`, credentials).pipe(
      finalize(() => this.loadingService.hide()),
      tap((response: any) => {
        if (response && response.token && response.user) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.user = response.user;
          this.token = response.token;
        }
      })
    );
  }

  register(user: any): Observable<any> {
    this.loadingService.show();
    return this.http
      .post(`${this.api_url}/auth/register`, user)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  private _logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  logout() {
    const dialogRef = this.dialog.open(AlertComponent, {
      data: {
        message: `Do you want to logout ?`,
        okMessage: 'Logout',
        okColor: 'warn',
        closeMessage: 'Cancel'
      },
      disableClose: true,
    });

    firstValueFrom(dialogRef.afterClosed()).then(data => {
      if(data) this._logout();
    })
  }

  get isAdmin(): boolean {
    return this.user?.role?.toUpperCase() === 'SUPER_ADMIN';
  }

  get isManager(): boolean {
    return this.user?.role?.toUpperCase() === 'ARTIST_MANAGER';
  }

  get userId(): any {
    return this.user?.id || null;
  }

  get authToken(): string {
    return this.token || '';
  }
}
