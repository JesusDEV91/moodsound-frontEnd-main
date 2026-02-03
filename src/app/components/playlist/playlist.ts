import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PlaylistService } from '../../services/playlist.service';
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
    MatProgressSpinnerModule
  ],
  templateUrl: './playlist.html',
  styleUrls: ['./playlist.css']
})
export class PlaylistComponent implements OnInit {
  playlist: PlaylistResponse | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  moodName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistService: PlaylistService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.moodName = params['mood'];
      this.loadPlaylist();
    });
  }

  loadPlaylist() {
    this.loading = true;
    this.errorMessage = '';

    this.playlistService.getPlaylist(this.moodName).subscribe({
      next: (playlist) => {
        this.playlist = playlist;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading playlist:', error);
        this.errorMessage = 'Error al cargar la playlist';
        this.loading = false;
      }
    });
  }

  refreshPlaylist() {
    this.loading = true;
    this.errorMessage = '';

    this.playlistService.refreshPlaylist(this.moodName).subscribe({
      next: (response) => {
        console.log('Playlist refreshed:', response);
        // Recargar la playlist
        this.loadPlaylist();
      },
      error: (error) => {
        console.error('Error refreshing playlist:', error);
        this.errorMessage = 'Error al actualizar la playlist';
        this.loading = false;
      }
    });
  }

  openTrack(track: Track) {
    window.open(track.externalUrl, '_blank');
  }

  goBack() {
    this.router.navigate(['/mood-selector']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}