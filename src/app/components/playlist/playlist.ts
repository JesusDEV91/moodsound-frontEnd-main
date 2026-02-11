import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { switchMap, finalize } from 'rxjs/operators';

// Servicios
import { PlaylistService } from '../../services/playlist.service';
import { PlayerService } from '../../services/player.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';

// Componentes
import { NavbarComponent } from '../navbar/navbar';

// Modelos
import { PlaylistResponse } from '../../models/playlist.model';
import { Track, TrackWithFavorite } from '../../models/track.model';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [
<<<<<<< HEAD
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    YouTubePlayerModule,
    NavbarComponent
=======
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatTooltipModule, YouTubePlayerModule, DragDropModule
>>>>>>> a2a4d270ec2cc0200aed479c42b0daf6de597c33
  ],
  templateUrl: './playlist.html',
  styleUrls: ['./playlist.css']
})
export class PlaylistComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private playlistService = inject(PlaylistService);
<<<<<<< HEAD
  private playerService = inject(PlayerService);
  private favoriteService = inject(FavoriteService);
  authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
=======
  private playerService = inject(PlayerService); // Tu servicio con Signals
>>>>>>> a2a4d270ec2cc0200aed479c42b0daf6de597c33

  playlist: PlaylistResponse | null = null;
  loading: boolean = true;
  refreshing: boolean = false;
  errorMessage: string = '';
<<<<<<< HEAD
  
=======

  // Variables para el Reproductor Flotante
  // Leemos directamente la señal del servicio
  currentTrack = this.playerService.currentTrack; 
  isMinimized: boolean = false;

  // Parámetros
>>>>>>> a2a4d270ec2cc0200aed479c42b0daf6de597c33
  moodName: string = '';
  intensity: number = 3;
  audience: string = 'ADULT';

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {
        this.moodName = params['mood'];
        return this.route.queryParams;
      })
    ).subscribe({
      next: (qParams) => {
        this.intensity = qParams['intensity'] || 3;
        this.audience = qParams['audience'] || 'ADULT';
        this.loadPlaylist();
      }
    });

    // Cargar favoritos si está autenticado
    if (this.authService.isAuthenticated()) {
      this.favoriteService.getFavorites().subscribe();
    }
  }

  loadPlaylist() {
    this.loading = true;
    this.errorMessage = '';
    
    this.playlistService.getPlaylist(this.moodName, this.audience)
      .pipe(finalize(() => { this.loading = false; this.refreshing = false; }))
      .subscribe({
        next: (playlist) => {
          if (playlist?.tracks) {
            if (this.audience === 'ADULT') {
              const kids = ['infantil', 'niños', 'kids', 'nursery', 'baby', 'cocomelon', 'reino', 'zoo', 'pipi', 'lulu'];
              playlist.tracks = playlist.tracks.filter(t => 
                !kids.some(word => (t.title + t.artist).toLowerCase().includes(word))
              );
            } else {
              const adult = ['reggaeton', 'trap', 'perreo', 'explicit', 'sexy', 'horror'];
              playlist.tracks = playlist.tracks.filter(t => 
                !adult.some(word => (t.title + t.artist).toLowerCase().includes(word))
              );
            }
          }
          this.playlist = playlist;
        },
        error: () => this.errorMessage = 'Error al cargar la música.'
      });
  }

  refreshPlaylist() {
    this.refreshing = true;
    this.loading = true;
    this.playlistService.refreshPlaylist(this.moodName, this.audience).subscribe({
      next: () => this.loadPlaylist(),
      error: () => { this.loading = false; this.refreshing = false; }
    });
  }

  openTrack(track: Track | TrackWithFavorite) {
    this.playerService.playTrack(track);
    this.isMinimized = false;
  }

<<<<<<< HEAD
  /**
   * Toggle favorito - añade o elimina de favoritos
   */
  toggleFavorite(track: Track | TrackWithFavorite, event: Event) {
    event.stopPropagation();

    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Debes iniciar sesión para guardar favoritos', 'Login', {
        duration: 3000,
      }).onAction().subscribe(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    const trackWithFav = track as TrackWithFavorite;
    const isFavorite = trackWithFav.isFavorite !== undefined 
      ? trackWithFav.isFavorite 
      : this.favoriteService.isFavorite(track.id);

    this.favoriteService.toggleFavorite(track.id).subscribe({
      next: () => {
        // Actualizar el estado local
        if (this.playlist?.tracksWithFavorite) {
          const index = this.playlist.tracksWithFavorite.findIndex(t => t.id === track.id);
          if (index !== -1) {
            this.playlist.tracksWithFavorite[index].isFavorite = !isFavorite;
          }
        }

        const message = isFavorite ? 'Eliminado de favoritos' : 'Añadido a favoritos';
        this.snackBar.open(message, '', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error toggling favorite:', error);
        this.snackBar.open('Error al actualizar favoritos', '', { duration: 2000 });
      }
    });
  }

  /**
   * Verifica si una canción está en favoritos
   */
  isFavorite(track: Track | TrackWithFavorite): boolean {
    const trackWithFav = track as TrackWithFavorite;
    if (trackWithFav.isFavorite !== undefined) {
      return trackWithFav.isFavorite;
    }
    return this.favoriteService.isFavorite(track.id);
  }

  /**
   * Obtiene las canciones (con o sin info de favoritos)
   */
  getTracks(): (Track | TrackWithFavorite)[] {
    if (this.playlist?.tracksWithFavorite) {
      return this.playlist.tracksWithFavorite;
    }
    return this.playlist?.tracks || [];
  }

  getMoodColor(): string {
    return this.playlist?.color || '#6366f1';
  }

  goBack() { 
    this.router.navigate(['/mood-selector'], { queryParams: { audience: this.audience } }); 
  }
  
  goHome() { 
    this.router.navigate(['/']); 
  }
=======
  closePlayer() {
    this.playerService.closePlayer();
  }

  getMoodColor(): string { return this.playlist?.color || '#6366f1'; }
  goBack() { this.router.navigate(['/mood-selector'], { queryParams: { audience: this.audience } }); }
  goHome() { this.router.navigate(['/']); }
>>>>>>> a2a4d270ec2cc0200aed479c42b0daf6de597c33
}