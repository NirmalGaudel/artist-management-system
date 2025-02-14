import { Component, inject } from '@angular/core';
import { globalModules, materialModules } from '../../gobalModules';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { ArtistService } from '../../services/artist.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-artist',
  imports: [
    ...globalModules,
    ...materialModules,
    MatDialogModule,
    MatDatepickerModule,
  ],
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.scss',
})
export class ArtistComponent {
  readonly dialogRef = inject(MatDialogRef<ArtistComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  authService = inject(AuthService);
  private artistService = inject(ArtistService);
  private fb = inject(FormBuilder);
  artistForm: FormGroup;

  constructor() {
    this.createForm();
  }

  createForm() {
    this.artistForm = this.fb.group({
      name: [this.data.name || '', Validators.required],
      dob: [this.data.dob || '', Validators.required],
      gender: [this.data.gender || '', Validators.required],
      address: [this.data.address || '', Validators.required],

      first_release_year: [
        this.data.first_release_year || '',
        [Validators.required, Validators.min(1900)],
      ],
      no_of_albums_released: [
        this.data.no_of_albums_released || '',
        Validators.required,
      ],
    });
  }

  onSubmit() {
    if (!this.data?.id) this.createArtist();
    else this.updateArtist();
  }

  createArtist() {
    const value = this.artistForm.value;
    value.dob = new Date(value.dob).toUTCString();

    firstValueFrom(this.artistService.createArtist(value)).then((res) => {
      this.dialogRef.close(true);
    });
  }

  updateArtist() {
    const updatedFields = Object.entries(this.artistForm.controls)
      .filter((item) => item[1].dirty)
      .reduce((a: any, c: any) => {
        a[c[0]] = c[1].value;
        return a;
      }, {});
    firstValueFrom(
      this.artistService.updateArtist(this.data.id, updatedFields)
    ).then((res) => {
      this.dialogRef.close(true);
    });
  }

  deleteArtist() {
    this.artistService.deleteArtist(this.data).then((res) => {
      if (res) this.dialogRef.close(true);
    });
  }
}
