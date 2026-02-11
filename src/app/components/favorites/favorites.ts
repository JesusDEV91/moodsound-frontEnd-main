import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FavoriteService } from '../../services/favorite.service';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar';
import { Track } from '../../models/track.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NavbarComponent
  ],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css']
})
export class FavoritesComponent implements OnInit {
  private favoriteService = inject(FavoriteService);
  private playerService = inject(PlayerService);
  private authService = inject(AuthService);
  private router = inject(Router);

  favorites: Track[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
  this.loading = true;
  this.errorMessage = '';

  this.favoriteService.getFavorites().subscribe({
    next: (response) => {
      console.log('Response completa:', response); // ⬅️ Debug
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response)) {
        this.favorites = response;
      } else if (response && Array.isArray(response.tracks)) {
        this.favorites = response.tracks;
      } else {
        this.favorites = [];
      }
      
      this.loading = false;
    },
    error: (error) => {
      console.error('Error loading favorites:', error);
      this.errorMessage = 'Error al cargar favoritos';
      this.loading = false;
      this.favorites = []; // ⬅️ Inicializar vacío en caso de error
    }
  });
}

  removeFavorite(trackId: number) {
    this.favoriteService.removeFavorite(trackId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(t => t.id !== trackId);
      },
      error: (error) => {
        console.error('Error removing favorite:', error);
        this.errorMessage = 'Error al eliminar de favoritos';
      }
    });
  }

  playTrack(track: Track) {
    this.playerService.playTrack(track);
  }

  goBack() {
    this.router.navigate(['/mood-selector']);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  get userName(): string {
    return this.authService.currentUser()?.username || 'Usuario';
  }
}