import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatProgressSpinnerModule
  ],
  templateUrl: './mood-selector.html',
  styleUrls: ['./mood-selector.css']
})
export class MoodSelectorComponent implements OnInit {
  userText: string = '';
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

  analyzeText() {
    if (!this.userText.trim()) {
      this.errorMessage = 'Por favor, escribe cómo te sientes';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.moodService.analyzeMood({ text: this.userText }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.detected && response.mood) {
          // Mood detectado, ir a playlist
          this.router.navigate(['/playlist', response.mood]);
        } else {
          // No detectado, mostrar mensaje
          this.errorMessage = response.message || 'No se pudo detectar tu estado de ánimo';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error analyzing mood:', error);
        this.errorMessage = 'Error al analizar el texto';
      }
    });
  }

  selectMood(moodName: string) {
    this.router.navigate(['/playlist', moodName]);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}