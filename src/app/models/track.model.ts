export interface Track {
  id: number;
  youtubeId: string;
  title: string;
  artist: string;
  album?: string;
  thumbnailUrl: string;
  externalUrl: string;
  durationMs?: number;
  popularity?: number;
  audienceType?: 'ADULT' | 'KIDS';
  createdAt?: string;
}

export interface TrackWithFavorite extends Track {
  isFavorite: boolean;
}