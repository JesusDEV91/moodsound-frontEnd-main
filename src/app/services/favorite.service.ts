import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Track } from '../models/track.model';

interface FavoriteResponse {
  message: string;
  favoriteId?: number;
  trackId?: number;
}

interface FavoritesListResponse {
  count: number;
  tracks: Track[];
}

interface CheckFavoriteResponse {
  isFavorite: boolean;
}

interface CountResponse {
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = `${environment.apiUrl}/favorites`;
  private http = inject(HttpClient);

  // Estado local de favoritos (cache)
  favoriteTracks = signal<Track[]>([]);
  favoriteIds = signal<Set<number>>(new Set());

  /**
   * Obtiene todos los favoritos del usuario
   */
getFavorites(): Observable<any> { // ⬅️ Cambiar a any temporalmente
  return this.http.get<any>(this.apiUrl).pipe(
    tap(response => {
      console.log('Response de favoritos:', response); // ⬅️ Debug
      
      let tracks: Track[] = [];
      
      // Si la respuesta es directamente un array
      if (Array.isArray(response)) {
        tracks = response;
      } 
      // Si la respuesta es un objeto con propiedad tracks
      else if (response && Array.isArray(response.tracks)) {
        tracks = response.tracks;
      }
      // Si es un objeto con count y tracks
      else if (response && response.count !== undefined && Array.isArray(response.tracks)) {
        tracks = response.tracks;
      }
      
      this.favoriteTracks.set(tracks);
      const ids = new Set(tracks.map(t => t.id));
      this.favoriteIds.set(ids);
    })
  );
}

  /**
   * Añade una canción a favoritos
   */
  addFavorite(trackId: number): Observable<FavoriteResponse> {
    return this.http.post<FavoriteResponse>(`${this.apiUrl}/add/${trackId}`, {}).pipe(
      tap(() => {
        const currentIds = new Set(this.favoriteIds());
        currentIds.add(trackId);
        this.favoriteIds.set(currentIds);
      })
    );
  }

  /**
   * Elimina una canción de favoritos
   */
  removeFavorite(trackId: number): Observable<FavoriteResponse> {
    return this.http.delete<FavoriteResponse>(`${this.apiUrl}/remove/${trackId}`).pipe(
      tap(() => {
        const currentIds = new Set(this.favoriteIds());
        currentIds.delete(trackId);
        this.favoriteIds.set(currentIds);
        
        const currentTracks = this.favoriteTracks();
        this.favoriteTracks.set(currentTracks.filter(t => t.id !== trackId));
      })
    );
  }

  /**
   * Verifica si una canción está en favoritos
   */
  checkFavorite(trackId: number): Observable<CheckFavoriteResponse> {
    return this.http.get<CheckFavoriteResponse>(`${this.apiUrl}/check/${trackId}`);
  }

  /**
   * Cuenta el número de favoritos
   */
  countFavorites(): Observable<CountResponse> {
    return this.http.get<CountResponse>(`${this.apiUrl}/count`);
  }

  /**
   * Verifica si un track está en favoritos (desde el cache local)
   */
  isFavorite(trackId: number): boolean {
    return this.favoriteIds().has(trackId);
  }

  /**
   * Toggle favorito (añade o elimina)
   */
  toggleFavorite(trackId: number): Observable<FavoriteResponse> {
    if (this.isFavorite(trackId)) {
      return this.removeFavorite(trackId);
    } else {
      return this.addFavorite(trackId);
    }
  }

  /**
   * Limpia el cache de favoritos
   */
  clearCache(): void {
    this.favoriteTracks.set([]);
    this.favoriteIds.set(new Set());
  }
}