import { Component, inject } from '@angular/core';
import { globalModules, materialModules } from '../../gobalModules';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ArtistService } from '../../services/artist.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-artist-import',
  imports: [...globalModules, ...materialModules, MatDialogModule],
  templateUrl: './artist-import.component.html',
  styleUrl: './artist-import.component.scss',
})
export class ArtistImportComponent {
  readonly dialogRef = inject(MatDialogRef<ArtistImportComponent>);
  readonly artistService = inject(ArtistService);
  readonly toastService = inject(ToastService);
  selectedFile: any;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    firstValueFrom(this.artistService.importArtists(formData)).then(res => {
      this.toastService.success("Artist data imported.");
      this.dialogRef.close(true);
    })
  }


}
