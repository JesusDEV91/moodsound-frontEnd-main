import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { MoodSelectorComponent } from './components/mood-selector/mood-selector';
import { PlaylistComponent } from './components/playlist/playlist';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'mood-selector', component: MoodSelectorComponent },
  { path: 'playlist/:mood', component: PlaylistComponent },
  { path: '**', redirectTo: '' }
];