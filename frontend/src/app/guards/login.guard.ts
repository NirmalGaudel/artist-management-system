import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})

export class LoginGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (token && user.id) {
      this.router.navigate(['/home']);
      return false;
    }
    if(!token !== !user ) {
      this.authService.logout();
    }
    return true;
  }
}
