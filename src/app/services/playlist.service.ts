import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment} from '../../environments/environment';
import { PlaylistResponse } from '../models/playlist.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private apiUrl = `${environment.apiUrl}/playlist`;

  constructor(private http: HttpClient) { }

  // Obtener playlist por mood
  getPlaylist(moodName: string): Observable<PlaylistResponse> {
    return this.http.get<PlaylistResponse>(`${this.apiUrl}/${moodName}`);
  }

  // Actualizar playlist desde YouTube
  refreshPlaylist(moodName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${moodName}/refresh`, {});
  }
}