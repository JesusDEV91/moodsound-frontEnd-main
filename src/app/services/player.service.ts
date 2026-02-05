import { Injectable, signal } from '@angular/core';
import { Track } from '../models/track.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  
  currentTrack = signal<Track | null>(null);

  playTrack(track: Track) {
    this.currentTrack.set(track);
  }

  closePlayer() {
    this.currentTrack.set(null);
  }
}