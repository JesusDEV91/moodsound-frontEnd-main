import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider'; 
import { AuthService } from '../../services/auth.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule 
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  authService = inject(AuthService);
  favoriteService = inject(FavoriteService);
  private router = inject(Router);

  goToFavorites() {
    this.router.navigate(['/favorites']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout();
  }

  get favoriteCount(): number {
    return this.favoriteService.favoriteIds().size;
  }

  get userName(): string {
    return this.authService.currentUser()?.fullName || 
           this.authService.currentUser()?.username || 
           'Usuario';
  }

  get userInitial(): string {
    const name = this.userName;
    return name.charAt(0).toUpperCase();
  }
}