import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';
import { UserComponent } from '../user/user.component';
import { AuthService } from '../../services/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [MatIconModule, MatButtonModule, MatToolbarModule, RouterModule, MatTooltipModule],
})
export class HeaderComponent {
  private dialog = inject(MatDialog);
  private userService = inject(UserService);
  private router = inject(Router);
  authService = inject(AuthService);
  toggleSidebar() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout();
  }

  async showProfile() {
    const profile = await firstValueFrom(this.userService.getProfile()).then(
      (res) => {
        this.dialog.open(UserComponent, { data: { ...res, readonly: true } });
      }
    );
  }
}
