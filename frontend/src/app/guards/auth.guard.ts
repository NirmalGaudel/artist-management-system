import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  canActivate(): boolean {
    
    if (!this.authService.authToken || !this.authService.userId) {
      this.toastService.error("Please login first");
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
  
}


@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  canActivate(): boolean {
    
    if (!this.authService.isAdmin) {
      this.toastService.error("Access denied");
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
  
}