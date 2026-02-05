import { Injectable, inject } from '@angular/core'; // Añadido inject
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Mood } from '../models/mood.model';
import { MoodAnalysisResponse } from '../models/mood-analysis.model';

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  private moodUrl = `${environment.apiUrl}/mood`;
  private playlistUrl = `${environment.apiUrl}/playlist`;
  
  private http = inject(HttpClient);

 
  getAllMoods(): Observable<Mood[]> {
    return this.http.get<Mood[]>(`${this.moodUrl}/all`);
  }

 
  analyzeMood(request: { text: string, intensity: number, audience: string }): Observable<MoodAnalysisResponse> {
   
    return this.http.post<MoodAnalysisResponse>(`${this.moodUrl}/analyze`, request);
  }

  getPlaylist(moodName: string, audience: string = 'ADULT'): Observable<any> {
    
    return this.http.get(`${this.playlistUrl}/${moodName}`, {
      params: { audience: audience }
    });
  }
}