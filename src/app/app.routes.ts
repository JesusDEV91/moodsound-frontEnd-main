import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { MoodSelectorComponent } from './components/mood-selector/mood-selector';
import { PlaylistComponent } from './components/playlist/playlist';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { FavoritesComponent } from './components/favorites/favorites';
import { ProfileComponent } from './components/profile/profile';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'mood-selector', 
    component: MoodSelectorComponent,
    canActivate: [authGuard]  
  },
  { 
    path: 'playlist/:mood', 
    component: PlaylistComponent,
    canActivate: [authGuard]  
  },
  { 
    path: 'favorites', 
    component: FavoritesComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];