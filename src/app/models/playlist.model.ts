import { Track } from './track.model';

export interface PlaylistResponse {
  mood: string;
  displayName: string;
  emoji: string;
  color: string;
  tracks: Track[];
}