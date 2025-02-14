import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard, RoleGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { UsersComponent } from './pages/users/users.component';
import { ArtistsComponent } from './pages/artists/artists.component';
import { MusicComponent } from './pages/music/music.component';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'auth/register', component: RegisterComponent,canActivate: [LoginGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'artists', component: ArtistsComponent, canActivate: [AuthGuard] },
  { path: 'music/:id', component: MusicComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
];
