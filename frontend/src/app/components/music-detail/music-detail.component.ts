import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MusicService } from '../../services/music.service';
import { firstValueFrom } from 'rxjs';
import { globalModules, materialModules } from '../../gobalModules';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-music-detail',
  imports: [
    ...globalModules,
    ...materialModules,
    MatDialogModule,
    MatDatepickerModule ,
  ],
  templateUrl: './music-detail.component.html',
  styleUrl: './music-detail.component.scss',
})
export class MusicDetailComponent {
  readonly dialogRef = inject(MatDialogRef<MusicDetailComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  authService = inject(AuthService);
  private musicService = inject(MusicService);
  private fb = inject(FormBuilder);
  musicForm: FormGroup;

  readonly genres = [
    { value: 'rnb', label: 'R&B' },
    { value: 'country', label: 'Country' },
    { value: 'classic', label: 'Classical' },
    { value: 'rock', label: 'Rock' },
    { value: 'jazz', label: 'Jazz' },
  ];

  constructor() {
    this.createForm();
  }

  createForm() {
    this.musicForm = this.fb.group({
      artist_id: [this.data.artist_id],
      title: [this.data.title || '', Validators.required],
      album_name: [this.data.album_name || '', Validators.required],
      genre: [this.data.genre || '', Validators.required],
    });
  }

  onSubmit() {
    if (!this.data?.id) this.createMusic();
    else this.updateMusic();
  }

  createMusic() {
    const value = this.musicForm.value;

    firstValueFrom(this.musicService.createMusic(value)).then((res) => {
      this.dialogRef.close(true);
    });
  }

  updateMusic() {
    const updatedFields = Object.entries(this.musicForm.controls)
      .filter((item) => item[1].dirty)
      .reduce((a: any, c: any) => {
        a[c[0]] = c[1].value;
        return a;
      }, {});
    firstValueFrom(
      this.musicService.updateMusic(this.data.id, updatedFields)
    ).then((res) => {
      this.dialogRef.close(true);
    });
  }

  deleteMusic() {
    this.musicService.deleteMusic(this.data).then((res) => {
      if (res) this.dialogRef.close(true);
    });
  }

  getGenreLabel(genre: any) {
    return this.genres.find((v) => v.value == genre)?.label || '';
  }
}
