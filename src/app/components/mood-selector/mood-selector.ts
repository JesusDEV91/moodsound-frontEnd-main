import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MoodService } from '../../services/mood.service';
import { Mood } from '../../models/mood.model';

@Component({
  selector: 'app-mood-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSliderModule
  ],
  templateUrl: './mood-selector.html',
  styleUrls: ['./mood-selector.css']
})
export class MoodSelectorComponent implements OnInit {
  userText: string = '';
  intensityValue: number = 3;
  
  // NUEVO: Variable para controlar la audiencia (Adulto por defecto)
  selectedAudience: 'ADULT' | 'KIDS' = 'ADULT'; 

  moods: Mood[] = [];
  loading: boolean = false;
  fetchingMoods: boolean = true;
  errorMessage: string = '';

  constructor(
    private moodService: MoodService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadMoods();
  }

  loadMoods() {
    this.fetchingMoods = true;
    this.moodService.getAllMoods().subscribe({
      next: (moods) => {
        this.moods = moods;
        this.fetchingMoods = false;
      },
      error: (error) => {
        console.error('Error loading moods:', error);
        this.errorMessage = 'Error al cargar los estados de ánimo';
        this.fetchingMoods = false;
      }
    });
  }

  // Método para cambiar la audiencia desde el HTML
  setAudience(audience: 'ADULT' | 'KIDS') {
    this.selectedAudience = audience;
  }

  analyzeText() {
    if (!this.userText.trim()) {
      this.errorMessage = 'Por favor, escribe cómo te sientes';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // MODIFICADO: Enviamos intensidad y audiencia al backend
    const request = { 
      text: this.userText, 
      intensity: this.intensityValue,
      audience: this.selectedAudience 
    };

    this.moodService.analyzeMood(request).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.detected && response.mood) {
          // Navegamos pasando AMBOS parámetros en la URL
          this.router.navigate(['/playlist', response.mood], { 
            queryParams: { 
              intensity: this.intensityValue,
              audience: this.selectedAudience 
            }
          });
        } else {
          this.errorMessage = response.message || 'No se pudo detectar tu estado de ánimo';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error al analizar el texto';
      }
    });
  }

  selectMood(moodName: string) {
    
    this.router.navigate(['/playlist', moodName], { 
      queryParams: { 
        intensity: this.intensityValue,
        audience: this.selectedAudience 
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}