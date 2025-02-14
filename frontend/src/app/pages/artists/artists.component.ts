import { Component, inject, ViewChild } from '@angular/core';
import { globalModules, materialModules } from '../../gobalModules';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { firstValueFrom } from 'rxjs';
import { ArtistService } from '../../services/artist.service';
import { MatDialog } from '@angular/material/dialog';
import { ArtistComponent } from '../../components/artist/artist.component';
import { ArtistImportComponent } from '../../components/artist-import/artist-import.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artists',
  imports: [
    ...globalModules,
    ...materialModules,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.scss',
})
export class ArtistsComponent {
  displayedColumns: string[] = [
    'id',
    'name',
    'gender',
    'first_release_year',
    'no_of_albums_released',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  pageLength: number;

  genders = [
    { value: 'm', label: 'Male' },
    { value: 'f', label: 'Female' },
    { value: 'o', label: 'Others' },
  ];

  private dialog = inject(MatDialog);
  private artistService = inject(ArtistService);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.paginator.pageSize = 10;
    this.getData();
  }

  getData() {
    firstValueFrom(
      this.artistService.getArtists(
        this.paginator.pageIndex + 1,
        this.paginator.pageSize,
        this.sortItem
      )
    ).then((res) => {
      this.dataSource.data = res.artists;
      this.pageLength = res.total;
    });
  }

  async showDetail(artist: any) {
    let data = artist?.id
      ? await firstValueFrom(this.artistService.getArtistById(artist.id))
          .then((res) => res)
          .catch(() => ({}))
      : {};

    const dialogRef = this.dialog.open(ArtistComponent, {
      data,
      disableClose: true,
    });
    firstValueFrom(dialogRef.afterClosed()).then((res) => {
      if (res) {
        this.getData();
      }
    });
  }

  deleteArtist(artist: any) {
    this.artistService.deleteArtist(artist).then((res) => {
      if (res) this.getData();
    });
  }

  get sortItem(): string {
    return this.sort.active && this.sort.direction
      ? this.sort.active + ' ' + this.sort.direction.toUpperCase()
      : '';
  }

  getGenderLabel(gender: string) {
    return (
      this.genders.find((g) => g.value == gender.toLowerCase())?.label || ''
    );
  }

  importArtists() {
    const diloagRef = this.dialog.open(ArtistImportComponent, {
      disableClose: false,
    });

    firstValueFrom(diloagRef.afterClosed()).then((data) => {
      if (data) this.getData();
    });
  }

  exportArtists() {
    firstValueFrom(this.artistService.exportArtists())
      .then((res) => {
        const link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);

        const blob = new Blob([res], { type: 'text/plain' });
        const objectURL = URL.createObjectURL(blob);

        link.href = objectURL;
        link.href = URL.createObjectURL(blob);

        link.download = `artist_export_${new Date().toISOString()}.csv`;
        link.click();
      })
      .catch((err) => {});
  }

  showMusic(artist: any) {
    this.router.navigate(['/music/' + artist.id]);
  }
}
