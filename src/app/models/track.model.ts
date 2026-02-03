export interface Track {
  id: number;
  youtubeId: string;
  title: string;
  artist: string;
  album: string | null;
  thumbnailUrl: string | null;
  externalUrl: string;
  durationMs: number | null;
  popularity: number | null;
  createdAt: string;
}