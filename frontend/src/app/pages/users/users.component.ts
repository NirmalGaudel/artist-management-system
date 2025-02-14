import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';
import { globalModules, materialModules } from '../../gobalModules';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../components/alert/alert.component';
import { AuthService } from '../../services/auth.service';
import { UserComponent } from '../../components/user/user.component';

@Component({
  selector: 'app-users',
  imports: [
    ...globalModules,
    ...materialModules,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  displayedColumns: string[] = [
    'role',
    'id',
    'name',
    'email',
    'phone',
    'created_at',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  pageLength: number;
  

  private dialog = inject(MatDialog);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  userId: any = this.authService.userId;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.paginator.pageSize = 10;
    this.getData();
  }

  getData() {
    firstValueFrom(
      this.userService.getUsers(
        this.paginator.pageIndex + 1,
        this.paginator.pageSize,
        this.sortItem
      )
    ).then((res) => {
      this.dataSource.data = res.users;
      this.pageLength = res.total;
    });
  }

  async showDetail(user: any) {
    let data = user?.id ? await firstValueFrom(this.userService.getUserById(user.id)).then(res => res).catch(() => ({})) : {};
    
    const dialogRef = this.dialog.open(UserComponent, {data, disableClose: true});
    firstValueFrom(dialogRef.afterClosed()).then(res => {
      if(res) {
        this.getData();
      }
    })
  }

  deleteUser(user: any) {
    this.userService.deleteUser(user).then(res => {
      if(res) this.getData();
    });
  }

  get sortItem(): string {
    return this.sort.active && this.sort.direction
      ? this.sort.active + ' ' + this.sort.direction.toUpperCase()
      : '';
  }
}
