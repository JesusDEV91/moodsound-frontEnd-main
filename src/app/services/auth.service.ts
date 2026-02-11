import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);
  private router = inject(Router);

  // Estado del usuario actual
  currentUser = signal<AuthResponse | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.loadUserFromStorage();
  }

  /**
   * Registra un nuevo usuario
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  /**
   * Inicia sesión
   */
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  /**
   * Verifica el token actual
   */
  verifyToken(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/verify`);
  }

  /**
   * Obtiene el perfil del usuario
   */
  getProfile(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/profile`);
  }

  /**
   * Cierra sesión
   */
  logout(): void {
    localStorage.removeItem('moodsound_token');
    localStorage.removeItem('moodsound_user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  /**
   * Obtiene el token almacenado
   */
  getToken(): string | null {
    return localStorage.getItem('moodsound_token');
  }

  /**
   * Obtiene los headers con autenticación
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Maneja el éxito de autenticación
   */
  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem('moodsound_token', response.token);
    localStorage.setItem('moodsound_user', JSON.stringify(response));
    this.currentUser.set(response);
    this.isAuthenticated.set(true);
  }

  /**
   * Carga el usuario desde localStorage al iniciar
   */
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