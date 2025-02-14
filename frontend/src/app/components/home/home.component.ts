import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(){
    if(this.authService.isAdmin) this.router.navigate(['/users']);
    else if(this.authService.isManager) this.router.navigate(['/artists']);
    else this.router.navigate(['/music']);
  }
}
