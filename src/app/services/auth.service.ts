import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, from } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);
  private router = inject(Router);

  
  currentUser = signal<AuthResponse | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.loadUserFromStorage();
  }

 
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const hashedPassword = await this.hashPassword(data.password);
    const registerData = {
      ...data,
      password: hashedPassword
    };
    return new Promise((resolve, reject) => {
      this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerData).subscribe({
        next: (response) => {
          this.handleAuthSuccess(response);
          resolve(response);
        },
        error: (error) => reject(error)
      });
    });
  }


  async login(data: LoginRequest): Promise<AuthResponse> {
    const hashedPassword = await this.hashPassword(data.password);
    const loginData = {
      ...data,
      password: hashedPassword
    };
    return new Promise((resolve, reject) => {
      this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData).subscribe({
        next: (response) => {
          this.handleAuthSuccess(response);
          resolve(response);
        },
        error: (error) => reject(error)
      });
    });
  }

 
  private async hashPassword(password: string): Promise<string> {
    const rounds = 10;
    return await bcrypt.hash(password, rounds);
  }

 
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

 
  verifyToken(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/verify`);
  }

 
  getProfile(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/profile`);
  }

  
  logout(): void {
    localStorage.removeItem('moodsound_token');
    localStorage.removeItem('moodsound_user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  
  getToken(): string | null {
    return localStorage.getItem('moodsound_token');
  }

 
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  
  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem('moodsound_token', response.token);
    localStorage.setItem('moodsound_user', JSON.stringify(response));
    this.currentUser.set(response);
    this.isAuthenticated.set(true);
  }

  
  private loadUserFromStorage(): void {
    const token = localStorage.getItem('moodsound_token');
    const userStr = localStorage.getItem('moodsound_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        console.error('Error parsing user from storage:', error);
        this.logout();
      }
    }
  }
}