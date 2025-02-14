import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, firstValueFrom, Observable, tap } from 'rxjs';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../components/alert/alert.component';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private toastService = inject(ToastService);
  private dialog = inject(MatDialog);
  private apiUrl = this.authService.api_url + '/music';

  getMusic(
    artistId: number,
    page: number = 1,
    limit: number = 10,
    sort: string = ''
  ): Observable<any> {
    this.loadingService.show();
    return this.http
      .get(`${this.apiUrl}?artist_id=${artistId}&limit=${limit}&page=${page}&sort=${sort}`, {
        headers: this.headers,
      })
      .pipe(finalize(() => this.loadingService.hide()));
  }

  getMusicById(id: string): Observable<any> {
    this.loadingService.show();
    return this.http
      .get(`${this.apiUrl}/${id}`, { headers: this.headers })
      .pipe(finalize(() => this.loadingService.hide()));
  }

  createMusic(music: any): Observable<any> {
    this.loadingService.show();
    return this.http
      .post(`${this.apiUrl}`, music, { headers: this.headers })
      .pipe(
        finalize(() => this.loadingService.hide()),
        tap((res: any) => {
          if (res && res.id)
            this.toastService.success(res.message || 'New music created');
        })
      );
  }

  updateMusic(id: string, music: any): Observable<any> {
    this.loadingService.show();
    return this.http
      .put(`${this.apiUrl}/${id}`, music, { headers: this.headers })
      .pipe(
        finalize(() => this.loadingService.hide()),
        tap((res: any) => {
          if (res && res.id)
            this.toastService.success(res.message || 'Music detail updated');
        })
      );
  }

  private _deleteMusic(id: string): Observable<any> {
    this.loadingService.show();
    return this.http
      .delete(`${this.apiUrl}/${id}`, { headers: this.headers })
      .pipe(
        finalize(() => this.loadingService.hide()),
        tap((res: any) => {
          if (res) this.toastService.success(res.message);
        })
      );
  }

  deleteMusic(music: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(AlertComponent, {
        data: {
          title: `Delete '${music.title}'?`,
          message: `This action cannot be undone.`,
          okMessage: 'Delete',
          okColor: 'warn',
        },
        disableClose: true,
      });

      firstValueFrom(dialogRef.afterClosed()).then((res) => {
        if (res) {
          firstValueFrom(this._deleteMusic(music.id))
            .then((res) => {
              resolve(true);
            })
            .catch((err) => {
              resolve(false);
            });
        } else {
          resolve(false);
        }
      });
    });
  }

  get headers() {
    return { Authorization: 'Bearer ' + this.authService.authToken };
  }
}
