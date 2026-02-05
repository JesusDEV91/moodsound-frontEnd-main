import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { switchMap } from 'rxjs';

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
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    YouTubePlayerModule
  ],
  templateUrl: './playlist.html',
  styleUrls: ['./playlist.css']
})
export class PlaylistComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private playlistService = inject(PlaylistService);
  private playerService = inject(PlayerService);

  playlist: PlaylistResponse | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  moodName: string = '';
  intensity: number = 3;
  audience: string = 'ADULT'; //

  ngOnInit() {
    
    this.route.params.pipe(
      switchMap(params => {
        this.moodName = params['mood'];
        return this.route.queryParams;
      })
    ).subscribe({
      next: (qParams) => {
        this.intensity = qParams['intensity'] || 3;
        this.audience = qParams['audience'] || 'ADULT'; // 
        this.loadPlaylist();
      }
    });
  }

  loadPlaylist() {
    this.loading = true;
    this.errorMessage = ''; 
    
    
    this.playlistService.getPlaylist(this.moodName, this.audience).subscribe({
      next: (playlist) => {
        this.playlist = playlist;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando playlist:', err);
        this.errorMessage = 'No se encontraron canciones para este perfil. Intenta actualizar.';
        this.loading = false;
      }
    });
  }

  openTrack(track: Track) {
    this.playerService.playTrack(track);
  }

  refreshPlaylist() {
    this.loading = true;
    
    this.playlistService.refreshPlaylist(this.moodName, this.audience).subscribe({
      next: () => this.loadPlaylist(),
      error: () => {
        this.errorMessage = 'Error al conectar con YouTube';
        this.loading = false;
      }
    });
  }

  goBack() { this.router.navigate(['/mood-selector']); }
  goHome() { this.router.navigate(['/']); }
}