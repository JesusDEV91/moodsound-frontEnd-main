import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { YouTubePlayerModule } from '@angular/youtube-player';

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
    MatProgressSpinnerModule,
    YouTubePlayerModule
  ],
  templateUrl: './playlist.html',
  styleUrls: ['./playlist.css']
})
export class PlaylistComponent implements OnInit {
  playlist: PlaylistResponse | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  moodName: string = '';
  intensity: number = 3;
  currentTrack: Track | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistService: PlaylistService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.moodName = params['mood'];
      this.route.queryParams.subscribe(qParams => {
        this.intensity = qParams['intensity'] || 3;
        this.loadPlaylist();
      });
    });
  }

  loadPlaylist() {
    this.loading = true;
    this.playlistService.getPlaylist(this.moodName).subscribe({
      next: (playlist) => {
        this.playlist = playlist;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar la playlist';
        this.loading = false;
      }
    });
  }

  openTrack(track: Track) {
    this.currentTrack = track;
  }

  closePlayer() {
    this.currentTrack = null;
  }

  refreshPlaylist() {
    this.loading = true;
    this.playlistService.refreshPlaylist(this.moodName).subscribe({
      next: () => this.loadPlaylist(),
      error: () => this.loading = false
    });
  }

  goBack() { this.router.navigate(['/mood-selector']); }
  goHome() { this.router.navigate(['/']); }
}