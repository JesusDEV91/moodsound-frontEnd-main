import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  fullName: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  register() {
    
    if (!this.username.trim() || !this.email.trim() || !this.password.trim() || !this.fullName.trim()) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'El email no es válido';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const registerData: RegisterRequest = {
      username: this.username,
      email: this.email,
      password: this.password,
      fullName: this.fullName
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Registro exitoso:', response);
        this.router.navigate(['/mood-selector']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error en registro:', error);
        this.errorMessage = error.error?.error || 'Error al registrar usuario';
      }
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}