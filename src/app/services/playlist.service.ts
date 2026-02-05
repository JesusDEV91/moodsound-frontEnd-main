import { Injectable, inject } from '@angular/core'; // Usamos inject que es más moderno
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PlaylistResponse } from '../models/playlist.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private apiUrl = `${environment.apiUrl}/playlist`;
  private http = inject(HttpClient);

  
  getPlaylist(moodName: string, audience: string = 'ADULT'): Observable<PlaylistResponse> {

    const params = new HttpParams().set('audience', audience);
    
    return this.http.get<PlaylistResponse>(`${this.apiUrl}/${moodName}`, { params });
  }

  
  refreshPlaylist(moodName: string, audience: string = 'ADULT'): Observable<any> {
    const params = new HttpParams().set('audience', audience);
    
    return this.http.post(`${this.apiUrl}/${moodName}/refresh`, {}, { params });
  }
}