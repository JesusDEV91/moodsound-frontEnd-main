import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-mini-player',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, YouTubePlayerModule],
  templateUrl: './mini-player.html',
  styleUrls: ['./mini-player.css']
})
export class MiniPlayerComponent {
  // Inyectamos el servicio para acceder a la canción actual
  public playerService = inject(PlayerService);
}