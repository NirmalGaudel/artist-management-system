import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, firstValueFrom, Observable, tap } from 'rxjs';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';
import { AlertComponent } from '../components/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private toastService = inject(ToastService);
  private dialog = inject(MatDialog);
  private apiUrl = this.authService.api_url + '/artists';

  getArtists(
    page: number = 1,
    limit: number = 10,
    sort: string = ''
  ): Observable<any> {
    this.loadingService.show();
    return this.http
      .get(
        `${this.apiUrl}?limit=${limit}&page=${page}&sort=${sort}`,
        this.headers
      )
      .pipe(finalize(() => this.loadingService.hide()));
  }

  getArtistNames() : Observable<any> {
    this.loadingService.show();
    return this.http
      .get(
        `${this.apiUrl}?select=id,name`,
        this.headers
      )
      .pipe(finalize(() => this.loadingService.hide()));
  }

  getArtistById(id: string): Observable<any> {
    this.loadingService.show();
    return this.http
      .get(`${this.apiUrl}/${id}`, this.headers)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  importArtists(formData: FormData): Observable<any> {
    this.loadingService.show();
    return this.http
      .post(`${this.apiUrl}/import`, formData, this.headers)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  exportArtists(): Observable<any> {
    this.loadingService.show();
    return this.http
      .get(`${this.apiUrl}/export`, {responseType: 'arraybuffer', headers: this.headers.headers})
      .pipe(finalize(() => this.loadingService.hide()));
  }

  createArtist(Artist: any): Observable<any> {
    this.loadingService.show();
    return this.http.post(`${this.apiUrl}`, Artist, this.headers).pipe(
      finalize(() => this.loadingService.hide()),
      tap((res: any) => {
        if (res && res.id)
          this.toastService.success(res.message || 'new artist created');
      })
    );
  }

  updateArtist(id: string, Artist: any): Observable<any> {
    this.loadingService.show();
    return this.http.put(`${this.apiUrl}/${id}`, Artist, this.headers).pipe(
      finalize(() => this.loadingService.hide()),
      tap((res: any) => {
        if (res && res.id)
          this.toastService.success(res.message || 'Artist detail updated');
      })
    );
  }

  private _deleteArtist(id: string): Observable<any> {
    this.loadingService.show();
    return this.http.delete(`${this.apiUrl}/${id}`, this.headers).pipe(
      finalize(() => this.loadingService.hide()),
      tap((res: any) => {
        if (res) this.toastService.success(res.message);
      })
    );
  }

  deleteArtist(artist: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(AlertComponent, {
        data: {
          title: `Delete '${artist.name}'?`,
          message: `This action cannot be undone.`,
          okMessage: 'Delete',
          okColor: 'warn',
        },
        disableClose: true,
      });

      firstValueFrom(dialogRef.afterClosed()).then((res) => {
        if (res) {
          firstValueFrom(this._deleteArtist(artist.id))
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
    return {
      headers: { Authorization: 'Bearer ' + this.authService.authToken },
    };
  }
}
