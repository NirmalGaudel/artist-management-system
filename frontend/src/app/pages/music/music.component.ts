import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { globalModules, materialModules } from '../../gobalModules';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MusicService } from '../../services/music.service';
import { firstValueFrom } from 'rxjs';
import { MusicDetailComponent } from '../../components/music-detail/music-detail.component';

@Component({
  selector: 'app-music',
  imports: [
    ...globalModules,
    ...materialModules,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './music.component.html',
  styleUrl: './music.component.scss',
})
export class MusicComponent {
  artistId: number;
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  displayedColumns: string[] = [
    'id',
    'title',
    'album_name',
    'genre',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  pageLength: number;

  readonly genres = [
    { value: 'rnb', label: 'R&B' },
    { value: 'country', label: 'Country' },
    { value: 'classic', label: 'Classical' },
    { value: 'rock', label: 'Rock' },
    { value: 'jazz', label: 'Jazz' },
  ];
  
  private musicService = inject(MusicService);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      try {
        this.artistId = parseInt(params.get('id') || '');
      } catch (error) {}
    });
  }

  ngAfterViewInit() {
    this.paginator.pageSize = 10;
    this.getData();
  }

  getData() {
    if (!this.artistId) return;
    firstValueFrom(
      this.musicService.getMusic(
        this.artistId,
        this.paginator.pageIndex + 1,
        this.paginator.pageSize,
        this.sortItem
      )
    ).then((res) => {
      this.dataSource.data = res.music;
      this.pageLength = res.total;
    });
  }

  async showDetail(music: any) {

    let data = music?.id
          ? await firstValueFrom(this.musicService.getMusicById(music.id))
              .then((res) => res)
              .catch(() => ({}))
          : {artist_id: this.artistId};
    
        const dialogRef = this.dialog.open(MusicDetailComponent, {
          data,
          disableClose: true,
        });
        firstValueFrom(dialogRef.afterClosed()).then((res) => {
          if (res) {
            this.getData();
          }
        });
  }

  deleteMusic(music: any) {
    this.musicService.deleteMusic(music).then(res => {
      if(res) this.getData();
    });
  }

  get sortItem(): string {
    return this.sort.active && this.sort.direction
      ? this.sort.active + ' ' + this.sort.direction.toUpperCase()
      : '';
  }

  getGenreLabel(genre:any){
    return this.genres.find(v => v.value == genre)?.label || '';
  }
}
