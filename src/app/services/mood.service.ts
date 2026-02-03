import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment} from '../../environments/environment'
import { Mood } from '../models/mood.model';
import { MoodAnalysisRequest, MoodAnalysisResponse } from '../models/mood-analysis.model';

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private apiUrl = `${environment.apiUrl}/mood`;

  constructor(private http: HttpClient) { }

  getAllMoods(): Observable<Mood[]> {
    return this.http.get<Mood[]>(`${this.apiUrl}/all`);
  }

  analyzeMood(request: MoodAnalysisRequest): Observable<MoodAnalysisResponse> {
    return this.http.post<MoodAnalysisResponse>(`${this.apiUrl}/analyze`, request);
  }
}