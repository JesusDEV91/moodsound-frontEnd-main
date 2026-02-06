import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { switchMap, finalize } from 'rxjs/operators';

// Servicios
import { PlaylistService } from '../../services/playlist.service';
import { PlayerService } from '../../services/player.service';

// Modelos
import { PlaylistResponse } from '../../models/playlist.model';
import { Track } from '../../models/track.model';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatTooltipModule, YouTubePlayerModule, DragDropModule
  ],
  templateUrl: './playlist.html',
  styleUrls: ['./playlist.css']
})
export class PlaylistComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private playlistService = inject(PlaylistService);
  private playerService = inject(PlayerService); // Tu servicio con Signals

  // Variables de estado
  playlist: PlaylistResponse | null = null;
  loading: boolean = true;
  refreshing: boolean = false;
  errorMessage: string = '';

  // Variables para el Reproductor Flotante
  // Leemos directamente la señal del servicio
  currentTrack = this.playerService.currentTrack; 
  isMinimized: boolean = false;

  // Parámetros
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

  openTrack(track: Track) {
    this.playerService.playTrack(track);
    this.isMinimized = false;
  }

  closePlayer() {
    this.playerService.closePlayer();
  }

  getMoodColor(): string { return this.playlist?.color || '#6366f1'; }
  goBack() { this.router.navigate(['/mood-selector'], { queryParams: { audience: this.audience } }); }
  goHome() { this.router.navigate(['/']); }
}