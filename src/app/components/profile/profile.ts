import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { FavoriteService } from '../../services/favorite.service';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    NavbarComponent
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private favoriteService = inject(FavoriteService);
  private router = inject(Router);

  favoriteCount: number = 0;
  editMode: boolean = false;

  ngOnInit() {
    this.loadFavoriteCount();
  }

  loadFavoriteCount() {
    this.favoriteService.countFavorites().subscribe({
      next: (response) => {
        this.favoriteCount = response.count;
      },
      error: (error) => {
        console.error('Error loading favorite count:', error);
      }
    });
  }

  get user() {
    return this.authService.currentUser();
  }

  get userInitial(): string {
    const name = this.user?.fullName || this.user?.username || 'U';
    return name.charAt(0).toUpperCase();
  }

  get memberSince(): string {
    if (this.user?.createdAt) {
      const date = new Date(this.user.createdAt);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    }
    return 'Hace poco';
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveChanges() {
    // TODO: Implementar actualización de perfil
    this.editMode = false;
    console.log('Guardar cambios del perfil');
  }

  goToFavorites() {
    this.router.navigate(['/favorites']);
  }

  goBack() {
    this.router.navigate(['/mood-selector']);
  }

  logout() {
    this.authService.logout();
  }
}