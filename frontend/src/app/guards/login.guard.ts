import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root',
})

export class LoginGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  canActivate(): boolean {

    if (this.authService.authToken && this.authService.userId) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
